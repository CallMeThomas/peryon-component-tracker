namespace Peryon.Endpoints.Auth.GetStravaMobileCallback;

public class GetStravaMobileCallbackRequest
{
    /// <summary>
    /// Authorization code from Strava (on success)
    /// </summary>
    public string? Code { get; set; }
    
    /// <summary>
    /// State parameter for CSRF protection
    /// </summary>
    public string? State { get; set; }
    
    /// <summary>
    /// Scopes granted by the user
    /// </summary>
    public string? Scope { get; set; }
    
    /// <summary>
    /// Error code (on failure)
    /// </summary>
    public string? Error { get; set; }
    
    /// <summary>
    /// Error description (on failure)
    /// </summary>
    public string? ErrorDescription { get; set; }
}