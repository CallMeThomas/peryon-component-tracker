using FastEndpoints;
using Microsoft.AspNetCore.Http.HttpResults;
using Peryon.SharedKernel.Interfaces;

namespace Peryon.Features.User.GetUser;

public class GetUserEndpoint(IRepository<Core.Entities.User> userRepository)
: Endpoint<GetUserRequest,
            Results<
            Ok<GetUserResponse>, NotFound>>
{
    public override void Configure()
    {
        Get("user/{userId}");
        AllowAnonymous();
    }

    public override async Task<Results<Ok<GetUserResponse>, NotFound>> ExecuteAsync(GetUserRequest req, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(req.UserId, ct);
        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(GetUserResponse.FromEntity(user));
    }
}
