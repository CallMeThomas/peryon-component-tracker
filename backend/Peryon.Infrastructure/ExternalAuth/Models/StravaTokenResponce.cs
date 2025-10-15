using System.Text.Json.Serialization;

public class StravaTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
    
    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; } = string.Empty;
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
    
    [JsonPropertyName("athlete")]
    public StravaAthleteResponse Athlete { get; set; } = new();
}

public class StravaAthleteResponse
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("firstname")]
    public string FirstName { get; set; } = string.Empty;

    [JsonPropertyName("lastname")]
    public string LastName { get; set; } = string.Empty;

    [JsonPropertyName("profile_medium")]
    public string? ProfilePicture { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }
}
