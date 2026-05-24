using Microsoft.AspNetCore.Components.WebAssembly.Http;

namespace CNSPlus.Web.Client.Auth;

// Tells the browser fetch API to include the auth cookie on cross-origin requests
// to the API. Without this, the cookie is silently dropped on cross-origin calls.
// Attached as a DelegatingHandler on the typed API client in phase 2.
public sealed class CredentialsHandler : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken cancellationToken)
    {
        request.SetBrowserRequestCredentials(BrowserRequestCredentials.Include);
        return base.SendAsync(request, cancellationToken);
    }
}
