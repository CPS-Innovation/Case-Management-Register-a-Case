using Cps.CaseManagement.Api.OpenApi.Filters;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.OpenApi.Models;

namespace Cps.CaseManagement.Api.OpenApi;

public class RegisterCaseApiOpenApiConfigurationOptions : BaseOpenApiConfigurationOptions
{
    public override List<IDocumentFilter> DocumentFilters { get; set; } = new List<IDocumentFilter>
    {
        new EnumDocumentFilter(),
        new MultiTypeDocumentFilter(),
        new DateOnlyDocumentFilter(),
        new OrderByTagsDocumentFilter(),
        new OAuth2SecurityDocumentFilter()
    };

    public override OpenApiInfo Info { get; set; } = new OpenApiInfo
    {
        Version = "1.0.0",
        Title = "Case Management Register a Case API Endpoints",
        Description = "HTTP API Endpoints for interaction with Case Management Register a Case.",
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

    public override IDictionary<string, OpenApiSecurityScheme> SecuritySchemes => new Dictionary<string, OpenApiSecurityScheme>
    {
        {
            "OAuth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new AuthorizationCodeFlow(),
                In = ParameterLocation.Header,
                Name = "Authorization",
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "OAuth2 Authorization Code Flow"
            }
        }
    };
}
