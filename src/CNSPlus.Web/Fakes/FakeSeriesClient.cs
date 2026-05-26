using System.Xml.Linq;
using CNSPlus.Shared;

namespace CNSPlus.Web.Fakes;

// Phase 3 stub. Reads from /content/series/{slug}.xml on each call.
// Replaces SeriesClient in DI until CNSPlus.Api exists.
public sealed class FakeSeriesClient : ISeriesClient
{
    private readonly ContentRoot _content;

    public FakeSeriesClient(ContentRoot content) => _content = content;

    public Task<Series> GetBySlugAsync(string slug)
        => GetBySlugAsync(slug, CancellationToken.None);

    public async Task<Series> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var path = Path.Combine(_content.Path, "series", slug, "series.xml");
        if (!File.Exists(path))
        {
            throw new ApiException("Series not found", 404, response: null, headers: null!, innerException: null);
        }

        var xml = await File.ReadAllTextAsync(path, cancellationToken);
        var root = XDocument.Parse(xml).Root
            ?? throw new InvalidOperationException($"Empty XML in {path}");

        return new Series
        {
            Id = Guid.Parse(root.Element("id")!.Value),
            UniverseId = Guid.Parse(root.Element("universeId")!.Value),
            Slug = root.Element("slug")!.Value,
            Title = root.Element("title")!.Value,
            Tagline = root.Element("tagline")?.Value,
            Description = root.Element("description")?.Value.Trim(),
            CoverImageUrl = root.Element("coverImageUrl") is { } cover ? new Uri(cover.Value, UriKind.RelativeOrAbsolute) : null,
            Genres = root.Element("genres")?.Elements("genre").Select(g => g.Value).ToList() ?? new List<string>(),
            Status = Enum.Parse<SeriesStatus>(root.Element("status")!.Value, ignoreCase: true),
            UpdateSchedule = root.Element("updateSchedule")?.Value,
            CreatedAt = DateTimeOffset.Parse(root.Element("createdAt")!.Value),
            UpdatedAt = DateTimeOffset.Parse(root.Element("updatedAt")!.Value),
        };
    }

    public Task<IReadOnlyList<Comic>> ListComicsAsync(string slug)
        => ListComicsAsync(slug, CancellationToken.None);

    public async Task<IReadOnlyList<Comic>> ListComicsAsync(string slug, CancellationToken cancellationToken)
    {
        var series = await GetBySlugAsync(slug, cancellationToken);
        var all = await FakeComicsClient.ReadAllAsync(_content, cancellationToken);
        return all
            .Where(c => c.SeriesId == series.Id)
            .OrderBy(c => c.PositionInSeries ?? int.MaxValue)
            .ToList();
    }
}
