using CNSPlus.Shared;
using CNSPlus.Web.Auth;
using CNSPlus.Web.Components;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveWebAssemblyComponents();

builder.Services.AddAuthorization();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddScoped<AuthenticationStateProvider, CookieAuthenticationStateProvider>();

var apiBaseUrl = builder.Configuration["Api:BaseUrl"]
    ?? throw new InvalidOperationException("Api:BaseUrl must be configured.");
var apiBaseUri = new Uri(apiBaseUrl);

builder.Services.AddHttpClient<ICreatorsClient, CreatorsClient>(c => c.BaseAddress = apiBaseUri);
builder.Services.AddHttpClient<ISeriesClient, SeriesClient>(c => c.BaseAddress = apiBaseUri);
builder.Services.AddHttpClient<IComicsClient, ComicsClient>(c => c.BaseAddress = apiBaseUri);
builder.Services.AddHttpClient<ICharactersClient, CharactersClient>(c => c.BaseAddress = apiBaseUri);

// Phase 3 fakes — read fixtures from /content/*.xml until CNSPlus.Api exists.
// These overrides win because they're registered last. Remove this whole
// block when the real API is reachable.
builder.Services.AddSingleton<CNSPlus.Web.Fakes.ContentRoot>();
builder.Services.AddScoped<ICharactersClient, CNSPlus.Web.Fakes.FakeCharactersClient>();
builder.Services.AddScoped<IComicsClient,     CNSPlus.Web.Fakes.FakeComicsClient>();
builder.Services.AddScoped<ISeriesClient,     CNSPlus.Web.Fakes.FakeSeriesClient>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();
app.UseAntiforgery();
app.MapStaticAssets();

// Phase 3 — serve /content/* directly from disk while the API doesn't exist.
// Remove this when CNSPlus.Api takes over and image assets move to a CDN.
var contentRoot = app.Services.GetRequiredService<CNSPlus.Web.Fakes.ContentRoot>();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(contentRoot.Path),
    RequestPath = "/content",
});

app.MapRazorComponents<App>()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(CNSPlus.Web.Client._Imports).Assembly);

app.Run();
