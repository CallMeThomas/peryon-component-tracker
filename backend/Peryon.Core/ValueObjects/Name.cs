namespace Peryon.Core.ValueObjects;

public record Name(string First, string Last)
{
    public string Initials => $"{First.ToUpper()[0]}{Last.ToUpper()[0]}";
    public override string ToString() => $"{First} {Last}";
}