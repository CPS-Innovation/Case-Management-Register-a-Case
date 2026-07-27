namespace Cps.CaseManagement.Api.Functions;

using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Cps.CaseManagement.Api.Attributes;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.Api.TelemetryEvents;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.Infrastructure.Telemetry;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;

public class RegisterCase(ILogger<RegisterCase> logger, IMdsService mdsService, IMdsArgFactory mdsArgFactory, IRequestValidator requestValidator, ITelemetryClient telemetryClient)
{
    private readonly ILogger<RegisterCase> _logger = logger;
    private readonly IMdsService _mdsService = mdsService;
    private readonly IMdsArgFactory _mdsArgFactory = mdsArgFactory;
    private readonly IRequestValidator _requestValidator = requestValidator;
    private readonly ITelemetryClient _telemetryClient = telemetryClient;

    [Function(nameof(RegisterCase))]
    [OpenApiOperation(operationId: nameof(RegisterCase), tags: ["MDS"], Description = "Registers a case in CMS.")]
    [CmsAuthValuesAuth]
    [BearerTokenAuth]
    [OpenApiParameter(name: HttpHeaderKeys.CorrelationId, In = Microsoft.OpenApi.Models.ParameterLocation.Header, Required = true, Type = typeof(string), Description = "Correlation identifier for tracking the request.")]
    [OpenApiRequestBody(ContentType.ApplicationJson, typeof(CaseRegistrationRequest), Description = "Body containing the NetApp connection to create")]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: ContentType.ApplicationJson, bodyType: typeof(CaseRegistrationResponseDto), Description = ApiResponseDescriptions.Success)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.BadRequest, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.BadRequest)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Unauthorized, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Unauthorized)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.Forbidden, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.Forbidden)]
    [OpenApiResponseWithBody(statusCode: HttpStatusCode.InternalServerError, contentType: ContentType.TextPlain, typeof(string), Description = ApiResponseDescriptions.InternalServerError)]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/cases")] HttpRequest req, FunctionContext functionContext)
    {
        var context = functionContext.GetRequestContext();

        var caseRegistrationRequest = await _requestValidator.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(req);

        if (!caseRegistrationRequest.IsValid)
        {
            _logger.LogWarning("Case registration request is invalid. CorrelationId: {CorrelationId}. Errors: {ValidationErrors}", context.CorrelationId, caseRegistrationRequest.ValidationErrors);
            return new BadRequestObjectResult(caseRegistrationRequest.ValidationErrors);
        }

        CaseRegistrationNormalizer.NormalizeDefendants(caseRegistrationRequest.Value);

        // Normalization can inject a placeholder defendant that never passed through the request
        // validator. Re-validate the normalized defendants so every rule on the defendant validator
        // applies to it.
        var defendantValidationErrors = await ValidateDefendantsAsync(caseRegistrationRequest.Value.Defendants);
        if (defendantValidationErrors.Count > 0)
        {
            _logger.LogWarning("Normalized case registration request is invalid. CorrelationId: {CorrelationId}. Errors: {ValidationErrors}", context.CorrelationId, defendantValidationErrors);
            return new BadRequestObjectResult(defendantValidationErrors);
        }

        var result = await _mdsService.RegisterCaseAsync(
            _mdsArgFactory.CreateRegisterCaseArg(
                context.CmsAuthValues,
                context.CorrelationId,
                caseRegistrationRequest.Value));

        _telemetryClient.TrackEvent(new CaseRegisteredEvent
        {
            CorrelationId = context.CorrelationId,
            EventTimestamp = DateTime.UtcNow,
            Urn = result.Urn,
            CaseId = result.CaseId,
            Username = context.Username
        });

        return new OkObjectResult(result);
    }

    private static async Task<List<string>> ValidateDefendantsAsync(IEnumerable<CaseRegistrationDefendant>? defendants)
    {
        if (defendants is null)
        {
            return [];
        }

        var validator = new CaseRegistrationDefendantValidator();
        var errors = new List<string>();

        foreach (var defendant in defendants)
        {
            var result = await validator.ValidateAsync(defendant);
            if (!result.IsValid)
            {
                errors.AddRange(result.Errors.Select(e => e.ErrorMessage));
            }
        }

        return errors;
    }
}