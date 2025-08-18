namespace Peryon.SharedKernel;


/// <summary>
/// Base types for all Entities which track state using a given Id.
/// </summary>
public abstract class BaseEntity<TId>
{
    public required TId Id { get; init; }
}
