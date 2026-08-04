namespace Cps.CaseManagement.Api.Helpers;

using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Cps.CaseManagement.Domain.Models;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

public class RequestValidator : IRequestValidator
{
    private readonly ILogger<RequestValidator> _logger;

    public RequestValidator(ILogger<RequestValidator> logger)
    {
        _logger = logger;
    }

    public async Task<ValidatableRequest<T>> GetJsonBody<T, V>(HttpRequest request)
        where V : AbstractValidator<T>, new()
    {
        using var reader = new StreamReader(request.Body);
        var requestJson = await reader.ReadToEndAsync();

        T? requestObject;
        try
        {
            requestObject = JsonSerializer.Deserialize<T>(requestJson);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Request body contained invalid JSON.");
            return InvalidRequest<T>("The request body contains invalid JSON.");
        }

        if (requestObject == null)
        {
            return InvalidRequest<T>("Deserialized object is null.");
        }

        var validator = new V();
        var validationResult = await validator.ValidateAsync(requestObject);

        return new ValidatableRequest<T>
        {
            Value = requestObject,
            IsValid = validationResult.IsValid,
            ValidationErrors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
        };
    }

    private static ValidatableRequest<T> InvalidRequest<T>(string errorMessage)
    {
        return new ValidatableRequest<T>
        {
            Value = default!,
            IsValid = false,
            ValidationErrors = new List<string> { errorMessage }
        };
    }
}