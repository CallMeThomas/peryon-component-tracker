using System.Diagnostics;
using Peryon.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Peryon.MigrationWorker.SeedData;

namespace Peryon.MigrationWorker;

public class Worker(
    IServiceProvider serviceProvider,
    IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private static readonly ActivitySource s_activitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var activity = s_activitySource.StartActivity("Migrating database", ActivityKind.Client);

        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await EnsureDatabaseAsync(dbContext, cancellationToken);
            await RunMigrationAsync(dbContext, cancellationToken);
            await EnsureDataSeedAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            activity?.AddException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task EnsureDatabaseAsync(AppDbContext dbContext, CancellationToken cancellationToken)
    {
        var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();
        var maxRetries = 3;
        var delay = TimeSpan.FromSeconds(5);

        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                var strategy = dbContext.Database.CreateExecutionStrategy();
                await strategy.ExecuteAsync(async () =>
                {
                    if (!await dbCreator.ExistsAsync(cancellationToken))
                    {
                        await dbCreator.CreateAsync(cancellationToken);
                    }
                });
                return; // Success - exit the retry loop
            }
            catch (Npgsql.NpgsqlException ex)
            {
                if (i == maxRetries - 1) throw; // If last retry, rethrow
                
                using var activity = s_activitySource.StartActivity("Database connection retry");
                activity?.SetTag("retry_attempt", i + 1);
                activity?.AddException(ex);
                
                await Task.Delay(delay, cancellationToken);
            }
        }
    }

    private static async Task RunMigrationAsync(AppDbContext dbContext, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await dbContext.Database.MigrateAsync(cancellationToken);
        });
    }

    private async Task EnsureDataSeedAsync(AppDbContext dbContext, CancellationToken cancellationToken)
    {
        // If there is at least one user in the db we assume that the db was previously seeded
        var env = serviceProvider.GetRequiredService<IHostEnvironment>();
        if (env.IsDevelopment() && !await dbContext.Users.AnyAsync(cancellationToken))
        {
            await Seeder.SeedAsync(dbContext, cancellationToken);
        }
    }
}