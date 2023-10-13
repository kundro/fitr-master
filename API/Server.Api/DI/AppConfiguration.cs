using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Services;
using Server.Common.Services;
using Server.Data.Contexts;
using Server.Data.Repositores;
using Server.Common.MvcActionFilters;
using Microsoft.OpenApi.Models;
using Server.Application.Contracts;
using Server.Data.Contracts;
using Server.Common.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Server.Api.DI
{
    public static class AppConfiguration
    {
        public static IServiceCollection ConfigureSwagger(this IServiceCollection services)
        {
            return services
                .AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Server.Api", Version = "v1" });
                });
        }

        public static IServiceCollection ConfigureControllers(this IServiceCollection services)
        {
            services.AddControllers(x =>
            {
                x.Filters.Add<AsyncActionFilter>();
            });

            return services;
        }

        public static IServiceCollection ConfigureServices(this IServiceCollection services)
        {
            return services
                .AddScoped<IPlatformService, PlatformService>()
                .AddScoped<IRunService, RunService>()
                .AddScoped<IFlowService, FlowService>();
        }

        public static IServiceCollection ConfigureRepositories(this IServiceCollection services)
        {
            return services
                .AddScoped<ErrorCollector>()
                .AddScoped<IFlowRepository, FlowRepository>()
                .AddScoped<IPlatformRepository, PlatformRepository>()
                .AddScoped<INodeRepository, NodeRepository>()
                .AddScoped<IPinRepository, PinRepository>()
                .AddScoped<IConnectorRepository, ConnectorRepository>()
                .AddScoped<IAliasRepository, AliasRepository>();
        }

        public static IServiceCollection ConfigureContexts(this IServiceCollection services, IConfiguration configuration)
        {
            return services
                .AddDbContext<DataContext>(options
                    => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        }

        public static IApplicationBuilder ConfigureHelpers(this IApplicationBuilder app)
        {
            var httpContextAccessor = app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
            UserHttpContext.Configure(httpContextAccessor);

            return app;
        }
    }
}
