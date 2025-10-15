namespace Peryon.Endpoints.Auth.PostRefreshToken;

public class TokenRefreshResponse
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public required int ExpiresIn { get; init; }
}