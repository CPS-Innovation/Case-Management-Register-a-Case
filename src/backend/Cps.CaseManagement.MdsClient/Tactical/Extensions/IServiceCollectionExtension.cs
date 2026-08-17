using Cps.CaseManagement.MdsClient.Tactical.Client;
using Cps.CaseManagement.MdsClient.Tactical.Factories;
using Microsoft.Extensions.DependencyInjection;

namespace Cps.CaseManagement.MdsClient.Tactical.Extensions;

public static class IServiceCollectionExtension
{
    public static void AddMdsClientTactical(this IServiceCollection services)
    {
        services.AddSingleton<IMdsRequestFactoryTactical, MdsRequestFactoryTactical>();
        services.AddHttpClient<IMdsClientTactical, MdsClient.Client.MdsClient>(MdsClient.Extensions.IServiceCollectionExtension.AddMdsClient);
    }
}
