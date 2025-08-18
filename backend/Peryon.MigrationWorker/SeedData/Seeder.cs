using System.Text.Json;
using Peryon.Infrastructure.Data;

namespace Peryon.MigrationWorker.SeedData
{
    public class Seeder
    {

        public static async Task SeedAsync(AppDbContext dbContext, CancellationToken cancellationToken = default)
        {
            var seedData = await GetSeedFromJson(cancellationToken);

            if (seedData == null) return;

            dbContext.Users.AddRange(seedData.Users);

            await dbContext.SaveChangesAsync(cancellationToken);
        }

        private static async Task<SeedModel?> GetSeedFromJson(CancellationToken cancellationToken)
        {
            var seedPath = Path.Combine(AppContext.BaseDirectory, "SeedData", "seed.json");
            if (!File.Exists(seedPath)) return null;

            var json = await File.ReadAllTextAsync(seedPath, cancellationToken);
            var seedData = JsonSerializer.Deserialize<SeedModel>(json);

            return seedData;
        }
    }
}