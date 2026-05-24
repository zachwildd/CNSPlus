using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace CNSPlus.Web.Client.Auth;

// Client-side AuthenticationStateProvider used inside Interactive WebAssembly components.
// Phase 1 stub: returns an anonymous user. Phase 4 will fetch /auth/me after login and
// hydrate claims from the response.
public sealed class JwtAuthenticationStateProvider : AuthenticationStateProvider
{
    private static readonly AuthenticationState Anonymous =
        new(new ClaimsPrincipal(new ClaimsIdentity()));

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
        => Task.FromResult(Anonymous);
}
