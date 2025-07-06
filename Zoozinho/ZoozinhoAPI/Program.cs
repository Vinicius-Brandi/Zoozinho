using ZooConsole.Repository;
using ZooConsole.Repository.Implementations;
using ZooConsole.Services;
using Microsoft.AspNetCore.Cors.Infrastructure;
using NHibernate.Cfg;
using System.Text.Json.Serialization;
using ZooConsole.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<CategoriaService>();

var isInMemory = builder.Configuration.GetValue("UseInMemory", false);
if (isInMemory)
{
    builder.Services.AddTransient<IRepositorio, RepositoryInMemory>();
}
else
{
    var connectionString = builder.Configuration
        .GetConnectionString("Default");
    // criar implementacao para ISessionFactory
    builder.Services.AddSingleton(c =>
    {
        var config = new Configuration().Configure();
        config.DataBaseIntegration(
            x => x.ConnectionString = connectionString
        );
        return config.BuildSessionFactory();
    });
    builder.Services.AddTransient<IRepository, RepositoryNHibernate>();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(
    b => b.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
    );

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();