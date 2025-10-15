using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Peryon.Core.Entities;
using Peryon.Endpoints.Auth.GetStravaMobileCallback;
using Peryon.SharedKernel.Interfaces;

namespace Peryon.Endpoints.Auth.PostStravaSession;

public class PostStravaSessionEndpoint(
    IRepository<User> userRepository,
    ILogger<PostStravaSessionEndpoint> logger)
    : Endpoint<PostStravaSessionRequest, Results<Ok<PostStravaSessionResponse>, BadRequest<string>, NotFound>>
{
    public override void Configure()
    {
        Post("/auth/strava/session");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Exchange session token for user authentication data";
            s.Description = "Mobile app calls this endpoint to exchange the temporary session token for user data and auth tokens";
        });
    }

    public override async Task<Results<Ok<PostStravaSessionResponse>, BadRequest<string>, NotFound>> ExecuteAsync(PostStravaSessionRequest req, CancellationToken ct)
    {
        try
        {
            logger.LogInformation("Processing session token exchange request for token: {SessionToken}", req.SessionToken);

            var userId = SessionStorage.GetAndRemoveSession(req.SessionToken);
            
            if (userId == null)
            {
                logger.LogWarning("Invalid or expired session token provided");
                return TypedResults.BadRequest("Invalid or expired session token");
            }

            var user = await userRepository.GetByIdAsync(userId.Value, ct);

            if (user == null)
            {
                logger.LogWarning("User not found for session token: {UserId}", userId);
                return TypedResults.NotFound();
            }

            var expiresIn = user.TokenExpiresAt.HasValue 
                ? Math.Max(0, (int)(user.TokenExpiresAt.Value - DateTime.UtcNow).TotalSeconds)
                : 0;

            var response = new PostStravaSessionResponse
            {
                AccessToken = user.StravaAccessToken ?? throw new InvalidOperationException("User has no access token"),
                RefreshToken = user.StravaRefreshToken ?? throw new InvalidOperationException("User has no refresh token"),
                ExpiresIn = expiresIn,
                User = new SessionUserResponse
                {
                    Id = user.Id.ToString(),
                    FirstName = user.Name.First,
                    LastName = user.Name.Last,
                    Email = user.Email,
                    StravaId = user.StravaId.ToString(),
                    ProfilePicture = user.ProfilePicture
                }
            };

            logger.LogInformation("Session token exchange successful for user {UserId}", user.Id);
            return TypedResults.Ok(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during session token exchange");
            return TypedResults.BadRequest($"An error occurred during session exchange: {ex.Message}");
        }
    }
}