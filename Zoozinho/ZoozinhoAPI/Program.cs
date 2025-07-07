using Microsoft.AspNetCore.Mvc;
using NHibernate;
using ZooConsole.Repository;
using ZooConsole.Repository.Implementations;
using ZooConsole.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<CategoriaService>();
builder.Services.AddTransient<EspecieService>();

var isInMemory = builder.Configuration.GetValue("UseInMemory", false);
if (isInMemory)
{
    builder.Services.AddTransient<IRepositorio, RepositoryInMemory>();
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("Default");

    builder.Services.AddSingleton<ISessionFactory>(c =>
    {
        var config = new NHibernate.Cfg.Configuration().Configure();
        config.DataBaseIntegration(x => x.ConnectionString = connectionString);
        return config.BuildSessionFactory();
    });

    builder.Services.AddTransient<IRepositorio, RepositoryNHibernate>();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
