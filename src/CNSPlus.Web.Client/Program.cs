using CNSPlus.Web.Client.Auth;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

builder.Services.AddAuthorizationCore();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddScoped<AuthenticationStateProvider, JwtAuthenticationStateProvider>();

// Phase 2 will register the NSwag-generated typed API client, attaching this handler
// so cross-origin requests carry the auth cookie.
builder.Services.AddTransient<CredentialsHandler>();

await builder.Build().RunAsync();
