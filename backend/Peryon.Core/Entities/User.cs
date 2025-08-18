using Peryon.Core.ValueObjects;
using Peryon.SharedKernel;
using Peryon.SharedKernel.Interfaces;

namespace Peryon.Core.Entities;

public class User : BaseEntity<Guid>, IAggregateRoot
{
    public required Name Name { get; init; }
    public required string Email { get; init; }
    public required Guid AthleteId { get; init; } // from strava
}