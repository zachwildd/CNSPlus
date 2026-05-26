namespace CNSPlus.Web.Fakes;

// Resolves the absolute path to the repository's /content directory.
// Defaults to ../../content relative to the project's content root
// (which ASP.NET sets to src/CNSPlus.Web/), so it lands at the repo root.
// Override with the Content:Root config key for tests or alternate layouts.
public sealed class ContentRoot
{
    public ContentRoot(IHostEnvironment env, IConfiguration config)
    {
        var configured = config["Content:Root"];
        Path = configured is null
            ? System.IO.Path.GetFullPath(System.IO.Path.Combine(env.ContentRootPath, "..", "..", "content"))
            : System.IO.Path.GetFullPath(configured, env.ContentRootPath);
    }

    public string Path { get; }
}
