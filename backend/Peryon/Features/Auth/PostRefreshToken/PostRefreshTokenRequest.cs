namespace Peryon.Endpoints.Auth.PostRefreshToken;

public class PostTokenRefreshRequest
{
    public required string RefreshToken { get; init; }
}