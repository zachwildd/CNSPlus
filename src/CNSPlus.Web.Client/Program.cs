using CNSPlus.Shared;
using CNSPlus.Web.Client.Auth;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddAuthorizationCore();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddScoped<AuthenticationStateProvider, JwtAuthenticationStateProvider>();

// Until /api/config returns the API base URL at boot (see §10 of the design doc),
// hardcode it. Phase 4 will swap in the dynamic config fetch.
var apiBaseUri = new Uri("http://localhost:3000");

builder.Services.AddTransient<CredentialsHandler>();

builder.Services.AddHttpClient<ICreatorsClient, CreatorsClient>(c => c.BaseAddress = apiBaseUri)
    .AddHttpMessageHandler<CredentialsHandler>();
builder.Services.AddHttpClient<ISeriesClient, SeriesClient>(c => c.BaseAddress = apiBaseUri)
    .AddHttpMessageHandler<CredentialsHandler>();
builder.Services.AddHttpClient<IComicsClient, ComicsClient>(c => c.BaseAddress = apiBaseUri)
    .AddHttpMessageHandler<CredentialsHandler>();
builder.Services.AddHttpClient<ICharactersClient, CharactersClient>(c => c.BaseAddress = apiBaseUri)
    .AddHttpMessageHandler<CredentialsHandler>();

await builder.Build().RunAsync();
