var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
                     .WithContainerName("peryon-postgres")
                     .WithLifetime(ContainerLifetime.Persistent)
                     .WithDataVolume("peryon-postgres-data")
                     .WithEndpoint(port: 5432, targetPort: 5432, name: "postgres")
                     .AddDatabase("Peryon");

builder.AddProject<Projects.Peryon_MigrationWorker>("migrations")
    .WithReference(postgres);

var peryonApi = builder.AddProject<Projects.Peryon>("peryonapi")
    .WithReference(postgres)
    .WithExternalHttpEndpoints();

builder.Build().Run();
