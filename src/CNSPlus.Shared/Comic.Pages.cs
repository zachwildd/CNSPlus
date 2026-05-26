namespace CNSPlus.Shared;

public partial class Comic
{
    public IReadOnlyList<ComicPage>? Pages { get; set; }
}

public sealed class ComicPage
{
    public int Number { get; set; }
    public IReadOnlyList<ComicPanel> Panels { get; set; } = Array.Empty<ComicPanel>();
}

public sealed class ComicPanel
{
    public int Number { get; set; }
    public Uri ImageUrl { get; set; } = default!;
    public string? Caption { get; set; }
    public string? AltText { get; set; }
}
