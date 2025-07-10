using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NHibernate;
using ZooConsole.Repository;
using ZooConsole.Repository.Implementations;
using ZooConsole.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<CategoriaService>();
builder.Services.AddTransient<EspecieService>();
builder.Services.AddTransient<RecintoService>();
builder.Services.AddTransient<HabitatService>();
builder.Services.AddTransient<GalpaoService>();

var isInMemory = builder.Configuration.GetValue<bool>("UseInMemory");
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


