namespace Peryon.Endpoints.Auth.PostStravaSession;

public class PostStravaSessionRequest
{
    /// <summary>
    /// Temporary session token from the mobile callback redirect
    /// </summary>
    public required string SessionToken { get; init; }
}