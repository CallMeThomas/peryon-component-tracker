using Peryon.Core.Interfaces;

namespace Peryon.Infrastructure.FileService;

public class LocalFileService : IFileService
{
    private readonly string basePath;

    public LocalFileService()
    {
        basePath = $"{AppDomain.CurrentDomain.BaseDirectory}floor-plans";
    }

    public async Task UploadFileAsync(Guid fileId, Stream content, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(basePath, fileId.ToString());
        Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

        using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write);
        await content.CopyToAsync(fileStream, cancellationToken);
    }

    public Task DeleteFileAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        var directoryPath = Path.Combine(basePath, fileId.ToString());
        if (Directory.Exists(directoryPath))
        {
            Directory.Delete(directoryPath, true);
        }

        return Task.CompletedTask;
    }

    public Task<Stream> GetFileStreamAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(basePath, fileId.ToString());

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("File not found", filePath);
        }

        return Task.FromResult<Stream>(new FileStream(filePath, FileMode.Open, FileAccess.Read));
    }
}
