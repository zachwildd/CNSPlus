using CNSPlus.Shared;
using CNSPlus.Web.Auth;
using CNSPlus.Web.Components;
using Microsoft.AspNetCore.Components.Authorization;

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

app.MapRazorComponents<App>()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(CNSPlus.Web.Client._Imports).Assembly);

app.Run();
