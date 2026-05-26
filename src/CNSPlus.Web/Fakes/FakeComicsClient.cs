using System.Globalization;
using System.Xml.Linq;
using CNSPlus.Shared;

namespace CNSPlus.Web.Fakes;

// Phase 3 stub. Reads from /content/comics/*.xml on each call.
// Replaces ComicsClient in DI until CNSPlus.Api exists.
public sealed class FakeComicsClient : IComicsClient
{
    private readonly ContentRoot _content;

    public FakeComicsClient(ContentRoot content) => _content = content;

    public Task<IReadOnlyList<Comic>> ListAsync(bool? featured, int? limit)
        => ListAsync(featured, limit, CancellationToken.None);

    public async Task<IReadOnlyList<Comic>> ListAsync(bool? featured, int? limit, CancellationToken cancellationToken)
    {
        var all = await ReadAllAsync(_content, cancellationToken);
        IEnumerable<Comic> q = all;
        if (limit is { } l) q = q.Take(l);
        return q.ToList();
    }

    public Task<Comic> GetByIdAsync(Guid id) => GetByIdAsync(id, CancellationToken.None);

    public async Task<Comic> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var all = await ReadAllAsync(_content, cancellationToken);
        var match = all.FirstOrDefault(c => c.Id == id);
        if (match is null)
        {
            throw new ApiException("Comic not found", 404, response: null, headers: null!, innerException: null);
        }
        return match;
    }

    internal static async Task<IReadOnlyList<Comic>> ReadAllAsync(ContentRoot content, CancellationToken cancellationToken)
    {
        var dir = Path.Combine(content.Path, "comics");
        if (!Directory.Exists(dir))
        {
            return Array.Empty<Comic>();
        }

        var comics = new List<Comic>();
        foreach (var path in Directory.EnumerateFiles(dir, "comic.xml", SearchOption.AllDirectories))
        {
            comics.Add(await ReadAsync(path, cancellationToken));
        }
        return comics;
    }

    private static async Task<Comic> ReadAsync(string path, CancellationToken cancellationToken)
    {
        var xml = await File.ReadAllTextAsync(path, cancellationToken);
        var root = XDocument.Parse(xml).Root
            ?? throw new InvalidOperationException($"Empty XML in {path}");

        return new Comic
        {
            Id = Guid.Parse(root.Element("id")!.Value),
            CreatedBy = Guid.Parse(root.Element("createdBy")!.Value),
            UniverseId = Guid.Parse(root.Element("universeId")!.Value),
            SeriesId = root.Element("seriesId") is { } sid ? Guid.Parse(sid.Value) : null,
            PositionInSeries = root.Element("positionInSeries") is { } pos
                ? int.Parse(pos.Value, CultureInfo.InvariantCulture)
                : null,
            Slug = root.Element("slug")!.Value,
            Title = root.Element("title")?.Value,
            ImageUrl = ParseUri(root.Element("imageUrl")?.Value) ?? new Uri("about:blank"),
            AltText = root.Element("altText")?.Value,
            Caption = root.Element("caption")?.Value.Trim(),
            Transcript = root.Element("transcript")?.Value.Trim(),
            Pages = ReadPages(root),
            PublishedAt = DateTimeOffset.Parse(root.Element("publishedAt")!.Value),
            CreatedAt = DateTimeOffset.Parse(root.Element("createdAt")!.Value),
            UpdatedAt = DateTimeOffset.Parse(root.Element("updatedAt")!.Value),
        };
    }

    private static Uri? ParseUri(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : new Uri(value, UriKind.RelativeOrAbsolute);

    private static IReadOnlyList<ComicPage>? ReadPages(XElement root)
    {
        var pagesEl = root.Element("pages");
        if (pagesEl is null) return null;

        return pagesEl.Elements("page")
            .Select(p => new ComicPage
            {
                Number = int.Parse(p.Element("number")!.Value, CultureInfo.InvariantCulture),
                Panels = (p.Element("panels")?.Elements("panel") ?? Enumerable.Empty<XElement>())
                    .Select(panel => new ComicPanel
                    {
                        Number = int.Parse(panel.Element("number")!.Value, CultureInfo.InvariantCulture),
                        ImageUrl = ParseUri(panel.Element("imageUrl")?.Value),
                        Caption = panel.Element("caption")?.Value.Trim(),
                        AltText = panel.Element("altText")?.Value,
                    })
                    .OrderBy(panel => panel.Number)
                    .ToList(),
            })
            .OrderBy(p => p.Number)
            .ToList();
    }
}
