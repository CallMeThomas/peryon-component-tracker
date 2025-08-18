using Peryon.Infrastructure;
using Peryon.Infrastructure.Data;
using Peryon.ServiceDefaults;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Peryon.Application;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddNpgsqlDbContext<AppDbContext>("Peryon");

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "CORS_POLICY",
                            builder =>
                            {
                                // builder.WithOrigins(baseUrlConfig.WebBase.Replace("host.docker.internal", "localhost").TrimEnd('/'), "localhost:6100", "localhost:6150");
                                builder.AllowAnyOrigin();
                                // builder.SetIsOriginAllowed(origin => true);
                                builder.AllowAnyMethod();
                                builder.AllowAnyHeader();
                            });
});

builder.Services
  .AddFastEndpoints()
  .SwaggerDocument(options =>
  {
      options.DocumentSettings = s =>
      {
          s.Title = "My API V1";
      };
  });

bool isDevelopment = builder.Environment.IsDevelopment();
builder.Services.AddInfrastructureDependencies(isDevelopment);
builder.Services.AddApplicationDependencies(isDevelopment);

var app = builder.Build();

app.MapDefaultEndpoints();

//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("CORS_POLICY");

app.UseFastEndpoints().UseSwaggerGen();

app.Run();
