using Peryon.Core.ValueObjects;
using Peryon.SharedKernel;
using Peryon.SharedKernel.Interfaces;

namespace Peryon.Core.Entities;

public class User : BaseEntity<Guid>, IAggregateRoot
{
    public required Name Name { get; init; }
    public required string Email { get; init; }
    public required long StravaId { get; init; }
    public string? ProfilePicture { get; set; }
    public string? StravaAccessToken { get; set; }
    public string? StravaRefreshToken { get; set; }
    public DateTime? TokenExpiresAt { get; set; }
    
    public bool IsTokenExpired => TokenExpiresAt == null || TokenExpiresAt <= DateTime.UtcNow.AddMinutes(5);
}
