using Cps.CaseManagement.Api.OpenApi.Filters;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;

namespace Cps.CaseManagement.Api.OpenApi;

public class BaseOpenApiConfigurationOptions : IOpenApiConfigurationOptions
{
    public virtual OpenApiInfo Info { get; set; } = new OpenApiInfo
    {
        Version = "1.0.0",
        Title = "CPS Case Management Register a Case API",
        Description = "HTTP API Endpoints for Case Management Register a Case system.",
        TermsOfService = null,
        Contact = new OpenApiContact()
        {
            Name = string.Empty,
            Email = string.Empty,
            Url = null,
        },
        License = new OpenApiLicense()
        {
            Name = string.Empty,
            Url = null,
        },
    };

    public virtual List<IDocumentFilter> DocumentFilters { get; set; } = [
        new EnumDocumentFilter(),
        new MultiTypeDocumentFilter(),
        new DateOnlyDocumentFilter(),
        new OrderByTagsDocumentFilter()
    ];

    public List<OpenApiServer> Servers { get; set; } = [];
    public OpenApiVersionType OpenApiVersion { get; set; } = OpenApiVersionType.V3;
    public bool IncludeRequestingHostName { get; set; } = true;
    public bool ForceHttp { get; set; }
    public bool ForceHttps { get; set; }
    public virtual IDictionary<string, OpenApiSecurityScheme> SecuritySchemes => new Dictionary<string, OpenApiSecurityScheme>();
    public virtual OpenApiSecurityRequirement SecurityRequirements => new OpenApiSecurityRequirement();
}
