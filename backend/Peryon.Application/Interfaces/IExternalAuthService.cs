namespace Peryon.Application.Interfaces;

using Peryon.Application.Authentication.Models;

public interface IExternalAuthService
{
    Task<ExternalTokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri, CancellationToken cancellationToken = default);
    Task<ExternalTokenResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
}