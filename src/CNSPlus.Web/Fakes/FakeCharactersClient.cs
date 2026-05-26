using System.Xml.Linq;
using CNSPlus.Shared;

namespace CNSPlus.Web.Fakes;

// Phase 3 stub. Reads from /content/characters/{slug}/character.xml on each call.
// Replaces CharactersClient in DI until CNSPlus.Api exists.
public sealed class FakeCharactersClient : ICharactersClient
{
    private readonly ContentRoot _content;

    public FakeCharactersClient(ContentRoot content) => _content = content;

    public Task<Character> GetBySlugAsync(string slug)
        => GetBySlugAsync(slug, CancellationToken.None);

    public async Task<Character> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var path = Path.Combine(_content.Path, "characters", slug, "character.xml");
        if (!File.Exists(path))
        {
            throw new ApiException("Character not found", 404, response: null, headers: null!, innerException: null);
        }

        return await ReadAsync(path, cancellationToken);
    }

    public Task<IReadOnlyList<Character>> ListAsync(int? limit)
        => ListAsync(limit, CancellationToken.None);

    public async Task<IReadOnlyList<Character>> ListAsync(int? limit, CancellationToken cancellationToken)
    {
        var dir = Path.Combine(_content.Path, "characters");
        if (!Directory.Exists(dir))
        {
            return Array.Empty<Character>();
        }

        var characters = new List<Character>();
        foreach (var path in Directory.EnumerateFiles(dir, "character.xml", SearchOption.AllDirectories))
        {
            characters.Add(await ReadAsync(path, cancellationToken));
        }

        IEnumerable<Character> ordered = characters.OrderBy(c => c.Name, StringComparer.OrdinalIgnoreCase);
        if (limit is { } l) ordered = ordered.Take(l);
        return ordered.ToList();
    }

    private static async Task<Character> ReadAsync(string path, CancellationToken cancellationToken)
    {
        var xml = await File.ReadAllTextAsync(path, cancellationToken);
        var root = XDocument.Parse(xml).Root
            ?? throw new InvalidOperationException($"Empty XML in {path}");

        return new Character
        {
            Id = Guid.Parse(root.Element("id")!.Value),
            CreatedBy = Guid.Parse(root.Element("createdBy")!.Value),
            UniverseId = Guid.Parse(root.Element("universeId")!.Value),
            Slug = root.Element("slug")!.Value,
            Name = root.Element("name")!.Value,
            ArtUrl = root.Element("artUrl") is { } art ? new Uri(art.Value, UriKind.RelativeOrAbsolute) : null,
            Description = root.Element("description")?.Value.Trim(),
            CreatedAt = DateTimeOffset.Parse(root.Element("createdAt")!.Value),
            UpdatedAt = DateTimeOffset.Parse(root.Element("updatedAt")!.Value),
        };
    }
}
