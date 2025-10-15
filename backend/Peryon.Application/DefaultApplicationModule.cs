using Microsoft.Extensions.DependencyInjection;

namespace Peryon.Application;

public static class DefaultApplicationModule
{
    public static void AddApplicationDependencies(this IServiceCollection services, bool isDevelopment)
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
        // Add common services
    }

    private static void RegisterDevelopmentOnlyDependencies(IServiceCollection services)
    {
        // Add development only services
    }

    private static void RegisterProductionOnlyDependencies(IServiceCollection services)
    {
        // Add production only services
    }
}