using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Peryon.Application.Interfaces;
using Peryon.Infrastructure.Data;

namespace Peryon.Endpoints.Auth.PostRefreshToken;

public class PostRefreshTokenEndpoint(IExternalAuthService externalAuthService, AppDbContext context)
    : Endpoint<PostTokenRefreshRequest, Results<Ok<TokenRefreshResponse>, UnauthorizedHttpResult, BadRequest<string>, NotFound, ProblemHttpResult>>
{

    public override void Configure()
    {
        Post("/api/auth/refresh");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Refresh expired access tokens";
            s.Description = "Uses a refresh token to obtain new access and refresh tokens from Strava";
        });
    }

    public override async Task<Results<Ok<TokenRefreshResponse>, UnauthorizedHttpResult, BadRequest<string>, NotFound, ProblemHttpResult>> ExecuteAsync(PostTokenRefreshRequest req, CancellationToken ct)
    {
        try
        {
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.StravaRefreshToken == req.RefreshToken, ct);

            if (user == null)
            {
                return TypedResults.Unauthorized();
            }

            var authResponse = await externalAuthService.RefreshTokenAsync(req.RefreshToken, ct);

            user.StravaAccessToken = authResponse.AccessToken;
            user.StravaRefreshToken = authResponse.RefreshToken;
            user.TokenExpiresAt = DateTime.UtcNow.AddSeconds(authResponse.ExpiresIn);

            await context.SaveChangesAsync(ct);

            var response = new TokenRefreshResponse
            {
                AccessToken = authResponse.AccessToken,
                RefreshToken = authResponse.RefreshToken,
                ExpiresIn = authResponse.ExpiresIn
            };

            return TypedResults.Ok(response);
        }
        catch (HttpRequestException ex)
        {
            return TypedResults.BadRequest($"Failed to refresh token with Strava: {ex.Message}");
        }
        catch (Exception ex)
        {
            return TypedResults.Problem($"An error occurred while refreshing token: {ex.Message}");
        }
    }
}