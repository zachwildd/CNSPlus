# CNSPlus — Architecture Design

> This document covers project layout, hosting,
> client/server boundary, and the standing decisions about how the Blazor app
> and the Node/Express API fit together.

## 1. Overview

**CNSPlus** is a multi-creator webcomic CMS that succeeds WebcomicX. It is
split into two independently-deployable services across two repositories:

| Repo | Stack | Role |
| --- | --- | --- |
| `CNSPlus` (this repo) | Blazor Web App on .NET 10 | The web frontend at `comicplus.net`. Owns rendering and user-facing UX. |
| `CNSPlus.Api` (separate repo, TBD) | Express.js + TypeScript (or JS) on Node | The REST API. Owns persistence, business rules, and authorization. |

The two services communicate over HTTPS using a REST contract published as
OpenAPI 3.x. The Blazor project consumes that contract via an NSwag-generated
typed client.

```
                     comicplus.net
                          │
                          ▼
              ┌────────────────────────┐
              │   CNSPlus (Blazor)     │   ASP.NET Core host
              │  ┌──────────────────┐  │   • SSR for public pages
              │  │ CNSPlus.Web      │  │   • Static assets for WASM
              │  │  (server host)   │  │   • Auth cookie handling
              │  └──────────────────┘  │
              │  ┌──────────────────┐  │
              │  │ CNSPlus.Web.Client│ │   Compiled to WebAssembly
              │  │  (interactive)   │  │   • Creator/admin pages
              │  └──────────────────┘  │
              └────────────┬───────────┘
                           │  HTTPS, JWT in HttpOnly cookie
                           │  (server-to-server during SSR;
                           │   browser-to-API for WASM pages)
                           ▼
              ┌────────────────────────┐
              │   CNSPlus.Api (Node)   │   Express.js
              │   • Auth, JWT issuance │
              │   • Postgres / JSON    │
              │   • OpenAPI 3.x spec   │
              └────────────────────────┘
```

The architecture is deliberately conservative — there is no GraphQL, no BFF
layer beyond what the Blazor host already is, no event bus, no microservices.
A single REST API with a typed client is enough for v1.

## 2. Goals and non-goals (architecture-specific)

These are scoped to *how* CNSPlus is built. Product / feature goals live in
the WebcomicY data-model design doc.

- **Clean separation of frontend and backend.** The Blazor repo never embeds
  business logic that belongs on the server. Authorization, validation, and
  data shape are all the API's job. The Blazor side is presentation,
  composition, and form input.
- **Compile-time safety against the API contract.** API changes that break
  the Blazor app should fail at build time, not at runtime, via the
  NSwag-generated client.
- **First-paint performance and SEO on public pages.** Webcomic reader pages
  are content pages. They must render server-side, return HTML on the first
  byte, and be crawlable.
- **Interactive richness on creator pages.** The creator admin (uploading
  comics, editing metadata, drag-reordering) is genuinely interactive and is
  fine to load as a WASM SPA.
- **Approachable to a contributor new to .NET / Blazor.** Layout, naming, and
  abstractions should not require knowing the Blazor ecosystem to read.
  No bespoke patterns where a vanilla one will do.

*Non-goals for v1*
- Multi-region or multi-tenant-per-domain deployments.
- Server-side rendering of *creator* pages (admin doesn't need SEO).
- A separate BFF or "API gateway" layer in front of `CNSPlus.Api`.
- Real-time updates (SignalR, websockets). Pull-on-load is fine.
- Offline support / PWA install. The Blazor WASM portion will work offline
  for already-loaded routes by accident, not by design.
- Internationalization beyond reserving room for it in DTOs.

## 3. Repository layout

```
CNSPlus/
├── CNAME                          # GitHub Pages → comicplus.net (currently)
├── LICENSE
├── README.md
├── global.json                    # Pins .NET SDK 10.x
├── Directory.Build.props          # MSBuild defaults: nullable, warnings-as-errors
├── Directory.Packages.props       # Central Package Management
├── NuGet.config                   # Restricts to nuget.org
├── .editorconfig
├── CNSPlus.slnx                   # Solution
├── design/
│   └── cnsplus-design.md          # ← this document
├── docs/
│   ├── contributing.md            # How to clone, build, run, contribute
│   ├── api-contract.md            # How the OpenAPI spec is consumed
│   └── decisions/                 # Lightweight ADRs (one file per decision)
├── openapi/
│   └── openapi.json               # Snapshot of the API contract (committed)
├── scripts/
│   ├── sync-openapi.sh            # Copies openapi.json from sibling CNSPlus.Api checkout
│   └── build-tailwind.sh          # Wraps `npm install && npm run build` with nvm
├── src/
│   ├── CNSPlus.Web/               # ASP.NET host + SSR components
│   │   ├── CNSPlus.Web.csproj
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   ├── Auth/
│   │   │   └── CookieAuthenticationStateProvider.cs
│   │   ├── Components/
│   │   │   ├── _Imports.razor
│   │   │   ├── App.razor          # Root: <HeadOutlet/> + <Routes/>
│   │   │   ├── Routes.razor
│   │   │   ├── Layout/
│   │   │   │   └── MainLayout.razor   # Default error/fallback layout only
│   │   │   └── Pages/             # SSR pages (public reader)
│   │   │       ├── Home.razor
│   │   │       ├── NotFound.razor
│   │   │       ├── Error.razor
│   │   │       ├── Character.razor    # /characters/{slug}
│   │   │       ├── Series.razor       # /collection/{slug} (route follows the upstream template)
│   │   │       ├── Comic.razor        # phase 3 — the reader
│   │   │       └── Creator.razor      # phase 3
│   │   └── wwwroot/
│   │       ├── css/app.css            # Tailwind output (gitignored, generated)
│   │       ├── css/webcomic-plus.css  # Public-reader stylesheet (committed verbatim from upstream)
│   │       └── favicon.png
│   ├── CNSPlus.Web.Client/        # WASM-side interactive components
│   │   ├── CNSPlus.Web.Client.csproj
│   │   ├── Program.cs
│   │   ├── _Imports.razor
│   │   ├── Auth/
│   │   │   ├── JwtAuthenticationStateProvider.cs
│   │   │   └── CredentialsHandler.cs
│   │   ├── Layout/                # Shared layouts — see "Where layouts live" below
│   │   │   ├── PublicLayout.razor
│   │   │   └── CreatorLayout.razor
│   │   └── Pages/                 # InteractiveWebAssembly pages (admin)
│   │       ├── Creator/
│   │       │   ├── Dashboard.razor
│   │       │   ├── Comics/        # phase 5+
│   │       │   │   ├── List.razor
│   │       │   │   ├── Upload.razor
│   │       │   │   └── Edit.razor
│   │       │   └── ...
│   │       └── Auth/              # phase 4
│   │           ├── Login.razor
│   │           └── Logout.razor
│   └── CNSPlus.Shared/            # DTOs + NSwag-generated client
│       ├── CNSPlus.Shared.csproj
│       ├── ApiClient.cs           # Generated in phase 2 (never edited by hand)
│       ├── ApiClient.nswag        # NSwag config; runs in pre-build
│       └── Models/                # Hand-written value types if any
├── tests/
│   ├── CNSPlus.Web.Tests/         # bUnit + xUnit for server-side components
│   └── CNSPlus.Web.Client.Tests/  # bUnit + xUnit for WASM components
└── tailwind/
    ├── package.json               # @tailwindcss/cli as a devDependency
    ├── .nvmrc                     # Node version pin (24) for nvm users
    └── input.css                  # Tailwind entry; compiles to wwwroot/css/app.css
```

**Naming.** Locked in: `CNSPlus.Web`, `CNSPlus.Web.Client`, `CNSPlus.Shared`.

**Why `src/` and `tests/`?** Conventional .NET layout. Many .NET repos
collapse this when there's only one project, but with three production
projects and two test projects it pays off in IDE tree clarity.

**Where layouts live.** Shared layouts (`PublicLayout`, `CreatorLayout`)
live in `CNSPlus.Web.Client`, not in the server project. The reason is
mechanical: WASM components are compiled into the Client assembly, which
the server project references — not the other way around. A WASM page
that referenced a layout in `CNSPlus.Web` would create a circular
project reference. Putting the layouts in the Client project means both
SSR pages (in `CNSPlus.Web`) and Interactive WebAssembly pages (in
`CNSPlus.Web.Client`) can use them. Server-only layouts (currently just
`MainLayout` for the error/fallback path) stay in `CNSPlus.Web`.

[this is not actually implemented and needs to change; i've since moved the the api in this repo ./api; i removed the old scrip to build the openapi.json so that should be added back to the api's package.json, instead of as a .sh script; also there is no CI verification]
**Why is `openapi.json` committed?** The API lives in a separate repo, so
the Blazor build needs a snapshot to generate against. Committing it makes
the generated client deterministic and reviewable, and means `dotnet build`
works offline. `scripts/sync-openapi.sh` copies the spec from a sibling
local checkout (`../CNSPlus.Api/openapi.json` by convention) into
`openapi/openapi.json`. The script is the only supported way to refresh
the snapshot; don't hand-edit `openapi.json`. CI verifies that the
committed snapshot matches what the API produces, so a stale snapshot
fails the build.

## 4. Hosting model — Blazor Web App with mixed render modes

CNSPlus uses the .NET 8+ **Blazor Web App** template. That template ships
*two* projects working together:

- **Server project** (`CNSPlus.Web`, `Microsoft.NET.Sdk.Web`): runs the
  ASP.NET host. Serves SSR HTML, static assets, the WASM boot, and is the
  place auth cookies get set/cleared.
- **Client project** (`CNSPlus.Web.Client`, `Microsoft.NET.Sdk.BlazorWebAssembly`):
  compiled to WebAssembly. Loaded only for components that opt into an
  interactive WASM render mode.

A component declares its render mode with a `@rendermode` directive:

```razor
@page "/comics/{slug}"
@* No directive needed — defaults to Static SSR for this page *@

<h1>@Comic.Title</h1>
<img src="@Comic.ImageUrl" alt="@Comic.AltText" />
```

```razor
@page "/creator/comics/upload"
@rendermode InteractiveWebAssembly

@* This component lives in CNSPlus.Web.Client so it can be compiled to WASM *@
<EditForm Model="@_model" OnValidSubmit="@HandleUpload"> ... </EditForm>
```

### Why mixed instead of all-WASM or all-Server?

- **Public reader pages** are content. They benefit from server-side
  rendering: fast TTFB, no WASM download before paint, full HTML for
  crawlers (image alt text, transcripts, structured data).
- **Creator admin pages** are app-like: forms, drag-reorder, multi-step
  uploads. WASM gives a snappy SPA feel without round-tripping every state
  change to the server.
- **Blazor Server** (SignalR-backed) was rejected because the data
  authority lives in `CNSPlus.Api`, not in `CNSPlus.Web`. Server-side
  interactivity would mean the host proxies REST calls back to the same
  network for every keystroke. The architecture has no benefit from a
  persistent stateful socket; it would just add complexity.

### Render-mode rules (CNSPlus convention)

1. Default to **Static SSR** (no `@rendermode`). Most pages don't need
   interactivity beyond `<a>` navigation.
2. Use **InteractiveWebAssembly** for forms, editors, dashboards, and any
   page that updates the DOM in response to user input.
3. **Never** use **InteractiveServer**. If a page seems to need it, write
   it as `InteractiveWebAssembly` and call the API directly from WASM.
4. **Never** use **InteractiveAuto** (renders Server first, transitions to
   WASM later). It's clever and confusing; pick one mode per page.

## 5. Client/server boundary and data flow

### From SSR pages (server-side rendering on `CNSPlus.Web`)

The server invokes the API server-to-server during prerender. The browser
never sees an API request for these pages.

```
Browser ──GET /comics/foo──▶ CNSPlus.Web (ASP.NET)
                                  │
                                  │  HttpClient.SendAsync (server-side)
                                  ▼
                            CNSPlus.Api  ──▶  DB
                                  │
                                  ▼
                            HTML response (fully rendered)
Browser ◀──────────────────── HTML
```

The auth cookie travels in two stages on SSR. The browser sends the cookie
to `CNSPlus.Web`. The Web project then forwards the bearer token from the
cookie as an `Authorization` header when calling the API. Public reader
pages don't require this — they hit unauthenticated endpoints.

### From interactive WASM pages (`CNSPlus.Web.Client`)

After the initial HTML loads and WASM boots, calls go directly from the
browser to the API.

```
Browser (WASM)  ──HTTPS, cookie auto-sent──▶  CNSPlus.Api
```

The cookie is set with `SameSite=Lax` (or `None` if the API is on a
different registrable domain — see §8) and `HttpOnly=true`. WASM cannot
read it, but the browser attaches it to API requests automatically.

## 6. The Shared project and DTO generation

`CNSPlus.Shared` is a single class library referenced by both
`CNSPlus.Web` and `CNSPlus.Web.Client`. It contains:

1. **The NSwag-generated API client** (`ApiClient.cs`), regenerated from
   `openapi/openapi.json` by an MSBuild target wired through `NSwag.MSBuild`.
2. **NSwag-generated DTOs** (request/response records).
3. **Hand-written value types** that aren't expressed in OpenAPI (smart
   enums, value object wrappers) — only when justified.

DTOs are *not* hand-written and they are *not* commit-only. Adding an
endpoint means: (a) update the API, (b) export OpenAPI, (c) commit the
spec, (d) `dotnet build` regenerates and surfaces breakage as compile
errors. This trade — owning the regeneration step in exchange for
compile-time safety against the API — is the central architectural bet.

### NSwag configuration

```jsonc
// CNSPlus.Shared/ApiClient.nswag
{
  "runtime": "Net100",
  "documentGenerator": {
    "fromDocument": { "json": "../../openapi/openapi.json" }
  },
  "codeGenerators": {
    "openApiToCSharpClient": {
      "className": "{controller}Client",
      "operationGenerationMode": "MultipleClientsFromOperationId",
      "namespace": "CNSPlus.Shared",
      "injectHttpClient": true,
      "useBaseUrl": false,
      "generateClientInterfaces": true,
      "generateDtoTypes": true,
      "jsonLibrary": "SystemTextJson",
      "dateType": "System.DateTimeOffset",
      "dateTimeType": "System.DateTimeOffset",
      "arrayType": "System.Collections.Generic.IReadOnlyList",
      "responseArrayType": "System.Collections.Generic.IReadOnlyList",
      "dictionaryType": "System.Collections.Generic.IReadOnlyDictionary",
      "responseDictionaryType": "System.Collections.Generic.IReadOnlyDictionary",
      "generateNullableReferenceTypes": true,
      "requiredPropertiesMustBeDefined": true,
      "output": "ApiClient.cs"
    }
  }
}
```

Wired into the build via NSwag.MSBuild (committed as a PackageReference
on `CNSPlus.Shared`) and a single MSBuild target with input/output
dependencies, so it only regenerates when the spec or the config file
changes:

```xml
<!-- CNSPlus.Shared.csproj -->
<Target Name="NSwagGenerate"
        BeforeTargets="BeforeCompile;CoreCompile"
        Inputs="../../openapi/openapi.json;ApiClient.nswag"
        Outputs="ApiClient.cs">
  <Exec Command="$(NSwagExe_Net100) run ApiClient.nswag /variables:Configuration=$(Configuration)"
        WorkingDirectory="$(MSBuildThisFileDirectory)" />
</Target>
```

Key option choices and why:

| Option | Value | Why |
| --- | --- | --- |
| `className` | `{controller}Client` | NSwag uses the part of the `operationId` before the `_` as the "controller." With operation IDs like `Creators_GetBySlug`, the result is a dedicated `CreatorsClient`, `SeriesClient`, `ComicsClient`, `CharactersClient` — each a small, focused interface. Easier to inject and mock than one fat `ApiClient`. |
| `injectHttpClient: true` + `useBaseUrl: false` | — | The client takes `HttpClient` via the constructor and uses its `BaseAddress`. Lets `AddHttpClient<TClient>` in DI own URL config; the client itself has no baseUrl property. |
| `jsonLibrary: SystemTextJson` | — | Matches modern .NET defaults; no Newtonsoft.Json dependency. |
| `dateType: System.DateTimeOffset` | — | Mirrors the WebcomicX-web DTO convention. `DateTime` is avoided for ambiguity reasons (instant vs. wall-clock). |
| `arrayType: IReadOnlyList` | — | Generated DTOs expose collections as read-only — discourages mutating server-issued data on the client. The instance type is still `List<T>` under the hood. |
| `generateNullableReferenceTypes: true` | — | Matches `<Nullable>enable</Nullable>` in `Directory.Build.props`. Properties marked `nullable: true` in OpenAPI emit as `string?` etc. |
| `requiredPropertiesMustBeDefined: true` | — | OpenAPI `required` properties become non-nullable on the DTO. Missing properties throw at deserialization. |

`generateClientInterfaces: true` is important — it gives `ICreatorsClient`,
`IComicsClient`, etc., which are what consumers inject. Replaceable with
hand-rolled fakes in tests.

### Runtime caveat

NSwag.MSBuild ships several precompiled exe variants
(`tools/Net80/`, `Net90/`, `Net100/`, `Win/`). The MSBuild target picks
one via the `$(NSwagExe_Net100)` property (matched to the `"runtime":
"Net100"` value in the config file). Each variant requires the
corresponding .NET runtime to be installed. On a machine with only .NET
6 and .NET 10 installed, picking `$(NSwagExe_Net90)` fails with exit
code 150 ("framework not found"). If NSwag.MSBuild releases a newer
version that drops the Net100 variant, the closest matching installed
runtime should be picked instead.

### DI registration

Both projects register the typed clients via `AddHttpClient<TInterface, TImpl>`:

```csharp
// CNSPlus.Web/Program.cs (server)
var apiBaseUri = new Uri(builder.Configuration["Api:BaseUrl"]
    ?? throw new InvalidOperationException("Api:BaseUrl must be configured."));
builder.Services.AddHttpClient<ICreatorsClient,  CreatorsClient> (c => c.BaseAddress = apiBaseUri);
builder.Services.AddHttpClient<ISeriesClient,    SeriesClient>   (c => c.BaseAddress = apiBaseUri);
builder.Services.AddHttpClient<IComicsClient,    ComicsClient>   (c => c.BaseAddress = apiBaseUri);
builder.Services.AddHttpClient<ICharactersClient, CharactersClient>(c => c.BaseAddress = apiBaseUri);
```

```csharp
// CNSPlus.Web.Client/Program.cs (WASM)
var apiBaseUri = new Uri("http://localhost:3000");  // phase 4 swaps this for a /api/config fetch

builder.Services.AddTransient<CredentialsHandler>();
builder.Services.AddHttpClient<ICreatorsClient, CreatorsClient>(c => c.BaseAddress = apiBaseUri)
    .AddHttpMessageHandler<CredentialsHandler>();
// (repeat for ISeriesClient, IComicsClient, ICharactersClient)
```

On the WASM side, every typed client gets `CredentialsHandler` chained
on — that's what flips `BrowserRequestCredentials.Include` so the auth
cookie travels with cross-origin requests (see §15).

### Package gotcha: `Microsoft.Extensions.Http` on WASM

`AddHttpClient` lives in `Microsoft.Extensions.Http`. The
`Microsoft.NET.Sdk.Web` SDK bundles it transitively, but
`Microsoft.NET.Sdk.BlazorWebAssembly` does not — the WASM project must
list it explicitly as a `PackageReference`. Without it, the
`builder.Services.AddHttpClient<…>` calls don't compile.

### Why a separate project for Shared?

So both `CNSPlus.Web` and `CNSPlus.Web.Client` reference the same compiled
DTOs and the same API client interface. Sharing types across the
SSR-server and the WASM-client boundary is the whole point.

### Fakes for development before the API exists

While `CNSPlus.Api` doesn't exist yet, in-process fakes implement the
typed client interfaces and serve fixtures from per-entity folders under
`/content/`. They live at `src/CNSPlus.Web/Fakes/`:

- `FakeCharactersClient : ICharactersClient` — reads
  `content/characters/{slug}/character.xml`.
- `FakeSeriesClient : ISeriesClient` — reads
  `content/series/{slug}/series.xml` and, for `ListComicsAsync`, scans
  `content/comics/*/comic.xml` and filters by `<seriesId>`.
- `FakeComicsClient : IComicsClient` — scans `content/comics/*/comic.xml`.
  `GetByIdAsync` enumerates all of them and matches on `<id>` (small N;
  fine). `ListAsync` returns the whole set, optionally truncated by
  `limit`; the `featured` flag is ignored because the DTO has no
  `featured` field.
- `ContentRoot` — DI singleton that resolves the absolute path to the
  repository's `/content/` directory once. Defaults to `../../content`
  relative to `IHostEnvironment.ContentRootPath` (which ASP.NET sets to
  `src/CNSPlus.Web/`); override with the `Content:Root` config key.

Each call opens the relevant file with `File.ReadAllTextAsync` and parses
with `XDocument`. Reads are lazy — content edits show up on the next
request without restarting the host. With only a handful of fixture
files, IO and parse cost are negligible.

#### Per-entity folder layout

```
content/
  characters/
    kyshumu/
      character.xml
      (image and any other binary assets the entity owns)
  series/
    comic-1/
      series.xml
  comics/
    comic-1/
      comic.xml
    comic-2/
      comic.xml
    ...
```

Each entity owns a folder named after its slug. The canonical metadata
file inside it is `{type}.xml` (`character.xml`, `series.xml`,
`comic.xml`). Image files and any other binary assets the entity owns
live alongside the XML. This generalizes cleanly to entities that
acquire multiple images (panel pages, art alts, cover variants).

#### XML conventions

Element names mirror the JSON property names in `openapi/openapi.json`
1:1 (`id`, `createdBy`, `universeId`, `seriesId`, `positionInSeries`,
etc.). Prose fields (`description`, `caption`, `transcript`) are wrapped
in `<![CDATA[…]]>` so authors can use literal newlines and angle
brackets. Array fields use a wrapper + repeated child
(`<genres><genre>action</genre><genre>sci-fi</genre></genres>`).
Nullable / optional fields are omitted entirely from the XML.

#### Image assets and `/content/` static-file serving

The Web host serves `/content/*` directly from the on-disk content
directory via `UseStaticFiles` mounted in `Program.cs`. URL fields in
the XML (`artUrl`, `imageUrl`, `coverImageUrl`) can be either absolute
URLs (matching what the real API will return once it issues CDN-backed
links) or root-relative paths like `/content/characters/kyshumu/art.png`
that point at files inside this directory. The fakes parse with
`UriKind.RelativeOrAbsolute` so both forms work — useful while content
is migrating from remote placeholders to local files.

Root-relative URLs resolve against whatever host served the page, so
the same XML works in dev (`localhost:5001`) and the eventual prod host
without configuration. The static-file mount and the fakes both come out
together when the real API takes over and assets move to a CDN.

#### DI registration

DI registration appends the fakes *after* the real `AddHttpClient<,>`
lines so the fakes win (last-registration wins for service lookups);
the static-file mount goes in the request pipeline after `MapStaticAssets`:

```csharp
// CNSPlus.Web/Program.cs
builder.Services.AddHttpClient<IComicsClient, ComicsClient>(c => c.BaseAddress = apiBaseUri);
// ...
// Phase 3 fakes — remove this whole block when the real API is reachable.
builder.Services.AddSingleton<ContentRoot>();
builder.Services.AddScoped<ICharactersClient, FakeCharactersClient>();
builder.Services.AddScoped<IComicsClient,     FakeComicsClient>();
builder.Services.AddScoped<ISeriesClient,     FakeSeriesClient>();

// ...later, after app.MapStaticAssets():
var contentRoot = app.Services.GetRequiredService<ContentRoot>();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(contentRoot.Path),
    RequestPath = "/content",
});
```

The fakes throw `ApiException` with the right status code on misses, so
pages get the same exception flow they will get against the real API. A
page handles 404 with:

```csharp
catch (ApiException ex) when (ex.StatusCode == 404)
{
    Nav.NavigateTo("/not-found");
}
```

This redirects (server-side 302) on SSR, taking the user to the
existing `NotFound` page.

The fakes are *only* on the server. WASM admin pages (phase 5+) still
have the real typed clients registered in `CNSPlus.Web.Client/Program.cs`
— they'll start working when the API exists, without changes.

### DTO / page name collisions

The Razor page class in `Pages/Character.razor` lives in
`CNSPlus.Web.Components.Pages` as a class literally named `Character`.
With `@using CNSPlus.Shared` in `_Imports.razor` (so pages can reference
DTO types unqualified), the bare name `Character` resolves to the page
class, not the DTO. Fully qualify the field type when this happens:

```razor
@code {
    private CNSPlus.Shared.Character? _character;   // not just `Character`
}
```

Affected page files today: `Character.razor`, `Series.razor`. New page
files with the same name as a DTO (e.g. `Comic.razor` in phase 4) will
need the same treatment.

Renaming page files to avoid the collision (e.g. `CharacterPage.razor`)
is the other option but feels worse — page names match the entity
they're about, and a one-line fully-qualified field is cheap.

## 7. UI — vanilla Razor components, two stylesheets

No component framework. Components are written by hand as `.razor` files.
**Two stylesheets** serve the two halves of the app:

| Stylesheet | Used by | Loaded |
| --- | --- | --- |
| `wwwroot/css/app.css` (Tailwind v4 output) | Creator / admin pages (`CreatorLayout`) | Globally via `App.razor` |
| `wwwroot/css/webcomic-plus.css` (committed verbatim from the Webcomic-plus template) | Public reader pages (`PublicLayout`) | Conditionally via `<HeadContent>` inside `PublicLayout` — only when that layout is active |

This split lines up with the architecture's two audiences. The public
reader has a distinct visual identity inherited from the original
Webcomic-plus template (CSS-grid body, slate-blue accents, sticky
burger-toggle header, CSS-only nav, `:has()`/`:target` driven
comic-reader). The creator admin is a CRUD UI where the look is
secondary — Tailwind utility classes make it cheap to build.

`webcomic-plus.css` is treated as third-party: copied as-is from
`/Users/zach/dev/sheldon/Webcomic-plus/css/style.css`, referenced by
class name from Razor components. Don't refactor it. If a rule needs to
change, change it in a layered override (`webcomic-plus-overrides.css`,
loaded after it) rather than editing the source — that preserves the
ability to diff against the upstream template later.

The Tailwind file does not leak into the reader pages: it's still
linked globally, but its utilities are unused there (the reader markup
uses Webcomic-plus class names exclusively). The reverse — webcomic-plus
on admin pages — is prevented by the conditional `<HeadContent>` load
in `PublicLayout`. Navigating from `/` (reader) to `/creator/dashboard`
(admin) unmounts `PublicLayout` and removes the stylesheet link from
the document head.

### Sections the layout exposes to public pages

`PublicLayout` owns the chrome and delegates four named slots to pages
via `<SectionOutlet>`. Pages fill them with `<SectionContent>`:

| Section name | Where it renders | Used by |
| --- | --- | --- |
| `page-title` | Inside the `<h1>` in the header chrome | Every public page |
| `hero` | Above the header (CSS `grid-area: content`) | Series page (the `comic-hero` banner) |
| `aside` | After main (CSS `grid-area: aside`) | Home (hidden by default), Series (visible) |
| `head-extras` | Inside the layout's `<HeadContent>` block | Pages that need page-scoped `<style>` or `<link>` |

```razor
@page "/characters/{Slug}"
@layout PublicLayout

<PageTitle>Characters · comicplus</PageTitle>
<SectionContent SectionName="page-title">Characters</SectionContent>

<div class="character-profile"> ... </div>
```

`<PageTitle>` controls the browser tab; the four sections above control
the chrome content. Both halves are page-owned; the layout provides
the slots.

### Why pages must never declare their own `<HeadContent>`

Blazor's `<HeadContent>` is *last-instance-wins*: a page-level
`<HeadContent>` displaces every parent layout's `<HeadContent>` entirely
(not merge — replace). Since `PublicLayout` uses `<HeadContent>` to
inject the `<link>` to `webcomic-plus.css`, any page that opened its own
`<HeadContent>` would silently break the stylesheet load.

The fix is structural: the layout owns the single `<HeadContent>` and
nests a `<SectionOutlet SectionName="head-extras" />` inside it. Pages
that need additional head content (per-page `<style>` blocks for the
"body class" pattern, per-page meta tags, etc.) push into that section
instead of opening their own `HeadContent`:

```razor
@* Series.razor — inject a scoped <style> override into the head *@
<SectionContent SectionName="head-extras">
    <style>
        main { background: ... }
        .main-nav li.is-active { background: ... }
    </style>
</SectionContent>
```

`<PageTitle>` is fine alongside this — it has its own dedicated
treatment in the framework and doesn't conflict with `<HeadContent>`.

### The "body class" problem and how we sidestep it

The upstream Webcomic-plus template sets `<body class="collection">` on
the series view (and `<body class="collection">` again on the comic
reader) to recolor `main`'s background and the active nav highlight.
Blazor pages can't set body classes directly — `<body>` lives in
`App.razor` at the root, and a routable page is several layers below it
with no built-in mechanism to reach up.

Three workable options, ranked:

1. **Page-scoped `<style>` injection via `head-extras`** *(current
   approach)*. The page pushes a `<style>` block that mirrors the
   `.collection main { ... }` and `.collection .main-nav li.is-active { ... }`
   rules but drops the `.collection` ancestor selector. Source order in
   `<head>` (link first, override style after) makes the page-scoped
   rules win for tie-broken specificity. Unmounts cleanly on navigation.
2. **JS interop to toggle `document.body.className`**. Cleaner in concept,
   requires JS, and doesn't compose well with SSR (the body class
   wouldn't be set in the initial HTML payload).
3. **A `BodyClassService` + cascading parameter pattern**. Adds
   ceremony; only worth it if many pages start needing this.

Option 1 is enough for now. If a third reader page needs body-class
behavior, revisit.

### Active nav state

`PublicLayout` computes `is-active` (the class the upstream CSS uses to
highlight the current menu item) from `NavigationManager.Uri`. Pages
don't opt in — landing on `/characters/anything` automatically lights
up the Characters `<li>`. The original template uses `.main-nav li.is-active`
as the selector, which is why the active class lives on the `<li>` and
not the `<a>` (precluding the built-in `<NavLink>` component).

### Tailwind build

Tailwind **v4**. The `tailwindcss` package (v4+) ships its own CLI as
`@tailwindcss/cli` — no PostCSS, no `postcss.config.js`, no
`autoprefixer`. Tailwind configuration lives in CSS itself via `@theme`
blocks; a `tailwind.config.js` is supported but not required.

The `tailwind/` directory holds its own `package.json` with
`@tailwindcss/cli` as a devDependency. `input.css` is just:

```css
@import "tailwindcss";

@theme {
  /* CNSPlus design tokens go here */
}
```

The Web project invokes it via an MSBuild target that calls a wrapper
script:

```xml
<!-- CNSPlus.Web.csproj -->
<Target Name="BuildTailwind" BeforeTargets="Build">
  <Exec Command="bash $(MSBuildThisFileDirectory)../../scripts/build-tailwind.sh" />
</Target>
```

The wrapper (`scripts/build-tailwind.sh`) sources nvm if it's present,
switches to the Node version pinned in `tailwind/.nvmrc`, installs
`node_modules` if missing, and runs `npm run build`. The indirection
exists because Tailwind v4 requires Node 20+ but a developer's default
`node` on PATH is often older (nvm doesn't auto-switch inside an MSBuild
`Exec` invocation). CI environments set up Node themselves and the
script no-ops on the nvm step.

`tailwind/package.json`:

```json
{
  "scripts": {
    "build": "tailwindcss -i ./input.css -o ../src/CNSPlus.Web/wwwroot/css/app.css --minify",
    "watch": "tailwindcss -i ./input.css -o ../src/CNSPlus.Web/wwwroot/css/app.css --watch"
  }
}
```

Tailwind output goes to `CNSPlus.Web/wwwroot/css/app.css`, referenced by
`App.razor` and served as a static asset. The output file is gitignored
— it's a build artifact, regenerated on every `dotnet build`. During
`dotnet watch`, developers run `npm run watch` from `tailwind/` in a
second terminal so class additions rebuild without restarting the .NET
host.

### Component conventions

- One component per file, `.razor` + optional `.razor.css` (scoped) and
  optional `.razor.cs` (code-behind, when `@code` blocks exceed ~25 lines).
- Components in `Components/Pages/` are routable (have `@page` directives).
  Components in `Components/Shared/` are reusable building blocks.
- No `Counter.razor` or `Weather.razor` survive into committed code.
- Props are `[Parameter] public ... { get; set; }`. Required props get
  `[EditorRequired]`.

### Shared component starter set

These will get built first because they appear everywhere:

| Component | Purpose |
| --- | --- |
| `<ComicImage>` | Renders comic image with alt, lazy-loading, sizing |
| `<CreatorLink>` | Profile link with avatar; consistent everywhere |
| `<SeriesBreadcrumb>` | Universe → Series → Comic crumb on reader pages |
| `<Field>` | Form field wrapper: label, input slot, validation message |
| `<SubmitButton>` | Submit button with loading state |
| `<Toast>` | Notification slot, fed by `IToastService` |

## 8. Authentication and authorization

Login flow uses JWT bearer tokens delivered to the browser inside an
**HttpOnly cookie**. The Blazor server reads the cookie during SSR and
forwards it as an `Authorization: Bearer …` header to the API when needed.

### Login

1. User submits email + password to `POST /auth/login` on the API.
2. API verifies credentials.
3. **The API sets the auth cookie itself** in its response (no exchange
   step on the Blazor side). The cookie has `HttpOnly`, `SameSite=Lax`,
   `Domain=.comicplus.net`, `Secure` (in production), and expiry matching
   the JWT.
4. The browser never receives the JWT directly. It only receives the
   cookie, which scripts cannot read.

This requires the API and the Blazor host to share a parent registrable
domain. The production deployment plan reflects that:

- `comicplus.net` (or `www.comicplus.net`) → `CNSPlus.Web` on Fly.io
- `api.comicplus.net` → `CNSPlus.Api` on Fly.io
- Cookie domain `.comicplus.net` covers both.

Local development needs slightly different cookie attributes and explicit
CORS — see §15.

### Authorization

All authorization is enforced by `CNSPlus.Api`. The Blazor app *may* hide
buttons based on the authenticated user's role (cosmetic), but never
relies on hidden UI for security.

Inside Blazor, the auth state is exposed via a custom
`AuthenticationStateProvider` that reads claims from a cached
representation of the JWT payload (fetched once after login via
`GET /auth/me`). `<AuthorizeView>` and `[Authorize]` on routable
components both work against this.

### Logout

`POST /auth/logout` on the Blazor host clears the cookie. The API does
not need to be called unless we adopt server-side token revocation
(deferred; JWT expiry handles v1).

### Token refresh

Refresh tokens are out of scope for v1. JWTs expire in 7 days; the user
re-logs in. If session length becomes a UX problem, add a refresh-token
cookie alongside the access cookie.

### Service registration: full Authorization on the server, Core on the client

`CNSPlus.Web` (server) registers `builder.Services.AddAuthorization()` —
the full ASP.NET Core authorization stack (`AuthorizationMiddleware`,
policy evaluation). .NET 10's Razor Components pipeline auto-wires
`UseAuthorization` and the host refuses to start if those services
aren't registered. `CNSPlus.Web.Client` (WASM) uses
`AddAuthorizationCore()` — there is no middleware in the browser, only
`<AuthorizeView>` and `[Authorize]` evaluating against the current
`AuthenticationState`. Both projects also register
`AddCascadingAuthenticationState()` so the auth state flows to child
components without explicit parameters.

## 9. State management

Blazor's built-in tools are sufficient for v1. No Fluxor, no Redux,
no `IStore<T>`.

- **Per-page state** lives in the component's `@code` block or code-behind.
- **Cross-page state** (current creator, auth status, toast queue) lives
  in scoped DI services registered in both `CNSPlus.Web` and
  `CNSPlus.Web.Client` `Program.cs`.
- **Server state** (lists of comics, a specific series) is fetched
  on-demand. No caching layer in v1.

If a page needs to share state with a sibling page beyond a single request
(unusual), we add a service. We do not introduce a generic state-management
abstraction until two unrelated features need it.

## 10. Configuration

Two configuration sources, no overlap:

- `appsettings.json` (and `appsettings.Development.json`) in
  `CNSPlus.Web/`. Holds the API base URL, allowed origins, cookie names.
- Environment variables override anything in `appsettings.*` for production.
  Deployment infrastructure (Docker, Render, whatever we pick) injects
  them.

The WASM client gets its config from a server endpoint
(`GET /api/config`) at boot time, returning the API base URL and similar
client-safe values. *Never* embed secrets in WASM — it ships to the
browser.

## 11. Build and repo conventions

These carry over from `WebcomicX-web/` (the abandoned scaffold), which
got these right even though the app on top was the default template.

| File | Purpose |
| --- | --- |
| `global.json` | Pins .NET SDK 10.x to avoid "works on my machine." |
| `Directory.Build.props` | `<Nullable>enable</Nullable>`, `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`, `<LangVersion>latest</LangVersion>`, `<RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>`, `<ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>`. |
| `Directory.Packages.props` | Central Package Management. All `<PackageVersion>` entries here; `.csproj` files use `<PackageReference Include="…" />` with no version. |
| `NuGet.config` | Restricts sources to `nuget.org` only. |
| `packages.lock.json` (per project) | Committed for deterministic restores. |
| `.editorconfig` | Style + naming, honored by C# Dev Kit and Rider. |
| `.gitignore` | Standard `dotnet new gitignore` plus Tailwind's `node_modules` and the generated `src/CNSPlus.Web/wwwroot/css/app.css`. |

### Framework-bundled packages and NU1510

.NET 10's `Microsoft.NET.Sdk.Web` bundles several ASP.NET Core packages
transitively, and the SDK now emits `NU1510` (treated as an error here)
when a `.csproj` redundantly lists a `PackageReference` for one of them
— for example `Microsoft.AspNetCore.Components.Authorization`. The Web
project relies on the SDK to provide these.

The `Microsoft.NET.Sdk.BlazorWebAssembly` SDK does *not* bundle the same
set, so `CNSPlus.Web.Client` references `Microsoft.AspNetCore.Components.Authorization`
(and others as needed) explicitly. Translation: don't blindly mirror the
package list between the two projects. If you get `NU1510`, remove the
redundant reference on the Web side; if you get `CS0234` for an auth
type on the Client side, add it there.

## 12. Testing

**Philosophy: minimum viable per phase.** Tests get written alongside the
code that ships, not before, and only for things where a test pays back
either as a regression catcher or as a check on subtle logic. Coverage is
not a goal. Filler tests (one for every getter, one for every nil-check)
are an anti-goal — they slow refactoring and create false confidence.

Per-phase test plan (mirrors §14):

| Phase | Tests worth writing | Skip |
| --- | --- | --- |
| 1. Scaffold | None. | All. |
| 2. OpenAPI stub | None. Compile-or-don't *is* the test. | All. |
| 3. Public reader E2E | One bUnit test per routable SSR page: "renders with valid data" + "renders the empty/missing state." Mock the API client at the interface level. | Layout/CSS tests, hover/focus, anything visual. |
| 4. Auth | `AuthenticationStateProvider` unit test (claims parsing from a sample JWT payload) + one login-flow happy-path test. | Cookie attribute tests — that's the browser's job, not yours. |
| 5. First creator/admin form | One bUnit test for required-field validation, one for submit happy-path, one for API-error display. | Drag/drop, file-picker UX, anything async-heavy. |
| 6+ | Per feature: render-with-data + one error path. Add a regression test only when a bug ships. | Coverage targets. Coverage as a goal produces filler. |

Tooling:

| Layer | Tool |
| --- | --- |
| Razor components | bUnit + xUnit |
| Domain helpers in `CNSPlus.Shared/Models/` | xUnit |
| End-to-end integration with the live API | Deferred. Testcontainers + xUnit when introduced post-MVP, but most of that lives in the API repo, not here. |

The API client is mocked at the *interface* level (`IComicsClient` etc.)
in component tests. No HTTP-level mocking in unit tests — if you're
reaching for `HttpMessageHandler` stubs, the test belongs in the API repo.

## 13. Deployment overview

V1 ships on **Fly.io**, with each service as a separate Fly app.

| Fly app | Repo | Domain | Notes |
| --- | --- | --- | --- |
| `cnsplus-web` | `CNSPlus` (this repo) | `comicplus.net`, `www.comicplus.net` | ASP.NET Core host. Static WASM + Tailwind assets served from `wwwroot/` by the same process. |
| `cnsplus-api` | `CNSPlus.Api` | `api.comicplus.net` | Node/Express. Owns Postgres connection, JWT signing. |

Each repo holds its own `fly.toml` and `Dockerfile`. The Web Dockerfile is
a two-stage build: a `node:lts` stage runs the Tailwind build, then a
`mcr.microsoft.com/dotnet/sdk:10.0` stage runs `dotnet publish`. The
runtime image is `mcr.microsoft.com/dotnet/aspnet:10.0`.

HTTPS terminates at Fly's edge. Cookies are issued with `Secure=true` in
production (the `Secure` attribute is conditional on `IWebHostEnvironment`
/ env config, not hardcoded — see §15 for the local dev setup).

The existing GitHub Pages binding on `CNAME` (`comicplus.net`) gets cut
over to the Fly app's address (`A`/`AAAA` records or Fly's edge
hostnames) when v1 goes live. The placeholder GitHub Pages site can stay
up until then; nothing is using the production domain yet.

## 14. Phasing

Suggested implementation order, after this design is signed off:

1. **Scaffold the Blazor Web App** with the project layout in §3. No
   features yet — just the shape, Tailwind compiling, an empty SSR home
   page, an empty WASM admin page, and the auth state provider plumbed in.
2. **Stub the API contract.** Write an initial `openapi.json` covering
   creators, universes, series, comics — even before the API itself
   exists. NSwag generates against it; we get compile errors that map to
   future API work.
3. **Public reader path end to end.** Home page → Creator → Series →
   Comic. SSR all the way. Hardcoded fixture responses in the API or a
   stub in the Web project; doesn't matter yet.
4. **Auth.** Login page, cookie issuance, `<AuthorizeView>`,
   `AuthenticationStateProvider`.
5. **Creator admin: upload a comic.** First InteractiveWebAssembly page.
6. **Iterate** through remaining creator pages.

Each phase ends with the app deployable and the build green.

## 15. Local development setup

Local dev mirrors production semantics on `localhost`. Both services run
on the developer's machine; the same cookie-based auth flow works because
browsers treat `localhost` as a single registrable domain even across
ports.

### Process layout

| Process | Host:Port | How to start |
| --- | --- | --- |
| `CNSPlus.Web` (Blazor host) | `https://localhost:5001` | `dotnet watch --project src/CNSPlus.Web` |
| `CNSPlus.Api` (Express) | `http://localhost:3000` | `npm run dev` in the sibling `CNSPlus.Api` checkout |
| Tailwind watcher | n/a | `npm --prefix tailwind run watch` (optional; only needed when iterating on classes) |

The Blazor host listens on HTTPS via the `dotnet dev-certs` cert.
Browsers treat `localhost` as a secure context, so `Secure` cookies
work; but in dev we issue cookies without `Secure` so that the API can
also run on plain HTTP (`http://localhost:3000`) without breaking the
cookie flow.

### Cookie attributes in dev vs. production

| Attribute | Dev | Production |
| --- | --- | --- |
| `HttpOnly` | `true` | `true` |
| `SameSite` | `Lax` | `Lax` |
| `Domain` | omitted (defaults to host) | `.comicplus.net` |
| `Secure` | `false` | `true` |
| `Path` | `/` | `/` |
| Expiry | matches JWT (e.g. 7d) | matches JWT |

The Express API picks these via an env var (`NODE_ENV` or
`COOKIE_SECURE`). Don't hardcode `Secure=true` — it will silently
break local dev on HTTP.

### CORS

Different ports on `localhost` are same-site (cookies flow) but
cross-origin (CORS applies). The Express API allows the Blazor origin
explicitly:

```js
app.use(cors({
  origin: ["https://localhost:5001"],
  credentials: true,
}));
```

`credentials: true` is what makes the browser actually attach the
cookie on cross-origin requests. Without it, the cookie is silently
dropped.

### HttpClient credentials on the Blazor side

WASM's `HttpClient` is a wrapper around the browser fetch API.
Cross-origin requests do *not* include credentials by default. CNSPlus
opts in globally via a `DelegatingHandler` registered on the typed API
client:

```csharp
// CNSPlus.Web.Client/Program.cs
public class CredentialsHandler : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        request.SetBrowserRequestCredentials(BrowserRequestCredentials.Include);
        return base.SendAsync(request, ct);
    }
}

builder.Services
    .AddHttpClient<IComicsClient, ComicsClient>(c => c.BaseAddress = apiBase)
    .AddHttpMessageHandler<CredentialsHandler>();
```

On the server side of `CNSPlus.Web` (during SSR), the host forwards the
incoming auth cookie when calling the API server-to-server. A separate
handler grabs the cookie from `HttpContext` and attaches it.

### Why not a dev reverse proxy?

A reverse proxy at the Blazor host that forwards `/api/*` to the Express
process would sidestep CORS entirely and make both sides look
same-origin in dev. We're not doing that: a dev-only abstraction that
disappears in production hides how the real architecture works and adds
a layer to debug. The CORS configuration is two lines.

### Running both services

The intended development loop is two terminals (plus an optional third
for Tailwind):

```sh
# terminal 1: API
cd ../CNSPlus.Api && npm run dev

# terminal 2: Blazor
dotnet watch --project src/CNSPlus.Web

# terminal 3 (optional): Tailwind class rebuild
npm --prefix tailwind run watch
```

A `Procfile` or `docker-compose.yml` may be added later if this becomes
annoying; not in v1.

### After API changes

When the API contract changes, the workflow is:

```sh
./scripts/sync-openapi.sh   # copies ../CNSPlus.Api/openapi.json into openapi/
dotnet build                # NSwag regenerates the C# client
```

Compile errors point to the Razor pages that need updating.

## 16. What this document is not

- Not a feature spec. Feature scope is in `webcomicy-design.md`.
- Not a coding-style guide. That belongs in `.editorconfig` and short
  conventions in `docs/contributing.md`.
- Not a deployment runbook. That comes when we have something to deploy.

When something in this document turns out to be wrong, update it. The
file is short on purpose — small enough to keep accurate.
