namespace CNSPlus.Shared;

public partial class Character
{
    public IReadOnlyList<CharacterAbility>? Abilities { get; set; }
}

public sealed class CharacterAbility
{
    public string Key { get; set; } = default!;
    public string? Type { get; set; }
    public string? Name { get; set; }
    public Uri? ImageUrl { get; set; }
    public string? Description { get; set; }

    public bool HasContent =>
        !string.IsNullOrWhiteSpace(Name) || !string.IsNullOrWhiteSpace(Description);
}
