using System.ComponentModel.DataAnnotations;

namespace Peryon.Features.User.GetUser;

public class GetUserResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Email { get; init; }
    public required long StravaId { get; init; }


    public static GetUserResponse FromEntity(Core.Entities.User user)
    {
        return new GetUserResponse
        {
            Id = user.Id,
            Name = user.Name.ToString(),
            Email = user.Email,
            StravaId = user.StravaId
        };
    }
}
