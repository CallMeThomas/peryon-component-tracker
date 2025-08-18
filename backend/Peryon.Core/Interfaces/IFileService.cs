namespace Peryon.Core.Interfaces;

public interface IFileService
{
    Task UploadFileAsync(Guid fileId, Stream content, CancellationToken cancellationToken = default);
    Task DeleteFileAsync(Guid fileId, CancellationToken cancellationToken = default);
    Task<Stream> GetFileStreamAsync(Guid fileId, CancellationToken cancellationToken = default);
}