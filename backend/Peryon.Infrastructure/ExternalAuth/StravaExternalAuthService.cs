using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Peryon.Application.Authentication.Models;
using Peryon.Application.Interfaces;
using System.Text;
using System.Text.Json;

namespace Peryon.Infrastructure.ExternalAuth;

public class StravaExternalAuthService : IExternalAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<StravaExternalAuthService> _logger;
    private const string StravaTokenEndpoint = "https://www.strava.com/oauth/token";

    public StravaExternalAuthService(HttpClient httpClient, IConfiguration configuration, ILogger<StravaExternalAuthService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ExternalTokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri, CancellationToken cancellationToken = default)
    {
        var clientId = _configuration["Strava:ClientId"] ?? throw new InvalidOperationException("Strava:ClientId not configured");
        var clientSecret = _configuration["Strava:ClientSecret"] ?? throw new InvalidOperationException("Strava:ClientSecret not configured");

        var request = new TokenRequest
        {
            ClientId = clientId,
            ClientSecret = clientSecret,
            Code = code,
            GrantType = "authorization_code"
        };

        _logger.LogInformation("Exchanging authorization code for access token");

        var stravaResponse = await MakeTokenRequestAsync(request, cancellationToken);
        return MapToExternalTokenResponse(stravaResponse);
    }

    public async Task<ExternalTokenResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var clientId = _configuration["Strava:ClientId"] ?? throw new InvalidOperationException("Strava:ClientId not configured");
        var clientSecret = _configuration["Strava:ClientSecret"] ?? throw new InvalidOperationException("Strava:ClientSecret not configured");

        var request = new TokenRequest
        {
            ClientId = clientId,
            ClientSecret = clientSecret,
            RefreshToken = refreshToken,
            GrantType = "refresh_token"
        };

        _logger.LogInformation("Refreshing Strava access token");

        var stravaResponse = await MakeTokenRequestAsync(request, cancellationToken);
        return MapToExternalTokenResponse(stravaResponse);
    }

    private async Task<StravaTokenResponse> MakeTokenRequestAsync(TokenRequest request, CancellationToken cancellationToken)
    {
        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(StravaTokenEndpoint, content, cancellationToken);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Strava API error: {StatusCode}, {Content}", response.StatusCode, errorContent);
            throw new HttpRequestException($"Strava API error: {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
        var tokenResponse = JsonSerializer.Deserialize<StravaTokenResponse>(responseContent) 
            ?? throw new InvalidOperationException("Failed to deserialize Strava token response");

        return tokenResponse;
    }

    private static ExternalTokenResponse MapToExternalTokenResponse(StravaTokenResponse stravaResponse)
    {
        return new ExternalTokenResponse
        {
            AccessToken = stravaResponse.AccessToken,
            RefreshToken = stravaResponse.RefreshToken,
            ExpiresIn = stravaResponse.ExpiresIn,
            User = new ExternalUserResponse
            {
                Id = stravaResponse.Athlete.Id.ToString(),
                FirstName = stravaResponse.Athlete.FirstName,
                LastName = stravaResponse.Athlete.LastName,
                Email = stravaResponse.Athlete.Email,
                ProfilePicture = stravaResponse.Athlete.ProfilePicture
            }
        };
    }
}