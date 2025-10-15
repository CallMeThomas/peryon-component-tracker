using Peryon.SharedKernel.Interfaces;
using Peryon.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Peryon.Core.Interfaces;
using Peryon.Infrastructure.FileService;
using Peryon.Application.Interfaces;
using Peryon.Infrastructure.ExternalAuth;

namespace Peryon.Infrastructure;

public static class DefaultInfrastructureModule
{
    public static void AddInfrastructureDependencies(this IServiceCollection services, bool isDevelopment)
    {
        if (isDevelopment)
        {
            RegisterDevelopmentOnlyDependencies(services);
        }
        else
        {
            RegisterProductionOnlyDependencies(services);
        }

        RegisterCommonDependencies(services);
    }

    private static void RegisterCommonDependencies(IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
        services.AddScoped(typeof(EfRepository<>));

        services.AddHttpClient<IExternalAuthService, StravaExternalAuthService>();
    }

    private static void RegisterDevelopmentOnlyDependencies(IServiceCollection services)
    {
        services.AddScoped<IFileService, LocalFileService>();
    }

    private static void RegisterProductionOnlyDependencies(IServiceCollection services)
    {
        // Add production only services
    }
}
