var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres", port: 5432)
                     .WithContainerName("peryon-postgres")
                     .WithLifetime(ContainerLifetime.Persistent)
                     .WithDataVolume("peryon-postgres-data")
                     .AddDatabase("Peryon");

builder.AddProject<Projects.Peryon_MigrationWorker>("migrations")
    .WithReference(postgres);

var peryonApi = builder.AddProject<Projects.Peryon>("peryonapi")
    .WithReference(postgres)
    .WithExternalHttpEndpoints();

builder.Build().Run();
