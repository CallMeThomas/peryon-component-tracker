namespace Peryon.Endpoints.Auth.PostStravaSession;

public class SessionUserResponse
{
    public required string Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required string StravaId { get; init; }
    public string? ProfilePicture { get; init; }
}

public class PostStravaSessionResponse
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public required int ExpiresIn { get; init; }
    public required SessionUserResponse User { get; init; }
}