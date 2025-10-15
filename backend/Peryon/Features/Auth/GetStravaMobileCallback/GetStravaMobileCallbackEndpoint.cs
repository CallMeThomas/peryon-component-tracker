using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Peryon.Application.Interfaces;
using Peryon.Core.Entities;
using Peryon.Core.ValueObjects;
using Peryon.Infrastructure.Data;
using Peryon.SharedKernel.Interfaces;
using System.Collections.Concurrent;

namespace Peryon.Endpoints.Auth.GetStravaMobileCallback;

/// <summary>
/// Simple in-memory session storage for temporary session tokens
/// In production, consider using Redis or database storage
/// </summary>
public static class SessionStorage
{
    private static readonly ConcurrentDictionary<string, SessionData> _sessions = new();
    
    public static void StoreSession(string sessionToken, Guid userId)
    {
        _sessions[sessionToken] = new SessionData 
        { 
            UserId = userId, 
            ExpiresAt = DateTime.UtcNow.AddMinutes(5) // 5 minute expiration
        };
        
        // Clean up expired sessions
        var expired = _sessions.Where(s => s.Value.ExpiresAt < DateTime.UtcNow).ToList();
        foreach (var session in expired)
        {
            _sessions.TryRemove(session.Key, out _);
        }
    }
    
    public static Guid? GetAndRemoveSession(string sessionToken)
    {
        if (_sessions.TryRemove(sessionToken, out var session) && session.ExpiresAt > DateTime.UtcNow)
        {
            return session.UserId;
        }
        return null;
    }
    
    private class SessionData
    {
        public Guid UserId { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}

public class GetStravaMobileCallbackEndpoint(
    IExternalAuthService externalAuthService,
    AppDbContext context,
    IRepository<User> userRepository,
    ILogger<GetStravaMobileCallbackEndpoint> logger)
    : Endpoint<GetStravaMobileCallbackRequest, Results<ContentHttpResult, BadRequest<string>>>
{
    public override void Configure()
    {
        Get("/auth/strava/mobile-callback");
        AllowAnonymous();
        Summary(s =>
        {
            s.Summary = "Handle Strava OAuth mobile callback (GET)";
            s.Description = "Receives the authorization code from Strava, exchanges for tokens, creates/updates user, and redirects back to mobile app with session token";
        });
    }

    public override async Task<Results<ContentHttpResult, BadRequest<string>>> ExecuteAsync(GetStravaMobileCallbackRequest req, CancellationToken ct)
    {
        try
        {
            // Handle error case
            if (!string.IsNullOrEmpty(req.Error))
            {
                logger.LogWarning("Strava OAuth error: {Error} - {ErrorDescription}", req.Error, req.ErrorDescription);
                
                var errorHtml = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Strava Authentication Error</title>
    <script>
        window.location.href = 'peryon://auth/strava/callback?error={Uri.EscapeDataString(req.Error)}&error_description={Uri.EscapeDataString(req.ErrorDescription ?? "")}';
    </script>
</head>
<body>
    <p>Authentication failed. Redirecting back to app...</p>
    <p>If you're not redirected, <a href='peryon://auth/strava/callback?error={Uri.EscapeDataString(req.Error)}'>click here</a></p>
</body>
</html>";
                return TypedResults.Text(errorHtml, "text/html");
            }

            // Handle success case
            if (string.IsNullOrEmpty(req.Code))
            {
                logger.LogWarning("No authorization code received from Strava");
                return TypedResults.BadRequest("No authorization code received");
            }

            logger.LogInformation("Processing Strava mobile callback with code: {Code}", req.Code[..8] + "...");

            // Exchange code for tokens with Strava
            var redirectUri = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/auth/strava/mobile-callback";
            var authResponse = await externalAuthService.ExchangeCodeForTokenAsync(req.Code, redirectUri, ct);

            // Check if user already exists
            var existingUser = await context.Users
                .FirstOrDefaultAsync(u => u.StravaId == long.Parse(authResponse.User.Id), ct);

            User user;
            
            if (existingUser != null)
            {
                logger.LogInformation("Updating existing user: {StravaId}", authResponse.User.Id);
                
                // Update existing user with new tokens and profile info
                existingUser.StravaAccessToken = authResponse.AccessToken;
                existingUser.StravaRefreshToken = authResponse.RefreshToken;
                existingUser.TokenExpiresAt = DateTime.UtcNow.AddSeconds(authResponse.ExpiresIn);
                existingUser.ProfilePicture = authResponse.User.ProfilePicture;
                
                user = existingUser;
            }
            else
            {
                logger.LogInformation("Creating new user: {StravaId}", authResponse.User.Id);
                
                // Create new user
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Name = new Name(authResponse.User.FirstName, authResponse.User.LastName),
                    Email = authResponse.User.Email ?? $"athlete{authResponse.User.Id}@strava.com",
                    StravaId = long.Parse(authResponse.User.Id),
                    ProfilePicture = authResponse.User.ProfilePicture,
                    StravaAccessToken = authResponse.AccessToken,
                    StravaRefreshToken = authResponse.RefreshToken,
                    TokenExpiresAt = DateTime.UtcNow.AddSeconds(authResponse.ExpiresIn)
                };

                await userRepository.AddAsync(user, ct);
            }

            await context.SaveChangesAsync(ct);

            // Generate temporary session token
            var sessionToken = Guid.NewGuid().ToString();
            SessionStorage.StoreSession(sessionToken, user.Id);

            logger.LogInformation("Authentication successful for user {UserId}, redirecting to mobile app with session token", user.Id);

            // Success - redirect to mobile app with session token
            var successHtml = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Strava Authentication Success</title>
    <script>
        window.location.href = 'peryon://auth/strava/callback?session_token={sessionToken}';
    </script>
</head>
<body>
    <p>Authentication successful! Redirecting back to app...</p>
    <p>If you're not redirected, <a href='peryon://auth/strava/callback?session_token={sessionToken}'>click here</a></p>
</body>
</html>";
            
            return TypedResults.Text(successHtml, "text/html");
        }
        catch (HttpRequestException ex)
        {
            logger.LogError(ex, "Failed to authenticate with Strava");
            return TypedResults.BadRequest($"Failed to authenticate with Strava: {ex.Message}");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during mobile callback processing");
            return TypedResults.BadRequest($"An error occurred during authentication: {ex.Message}");
        }
    }
}