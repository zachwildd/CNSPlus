using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace CNSPlus.Web.Auth;

// Server-side AuthenticationStateProvider used during SSR.
// Phase 1 stub: returns an anonymous user. Phase 4 will read the JWT claims
// from the auth cookie carried in HttpContext.
public sealed class CookieAuthenticationStateProvider : AuthenticationStateProvider
{
    private static readonly AuthenticationState Anonymous =
        new(new ClaimsPrincipal(new ClaimsIdentity()));

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
        => Task.FromResult(Anonymous);
}
