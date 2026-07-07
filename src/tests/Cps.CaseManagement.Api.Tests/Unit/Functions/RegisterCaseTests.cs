using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AutoFixture;
using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Context;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.Api.Helpers;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.Api.Validators;
using Cps.CaseManagement.Domain.Models;
using Cps.CaseManagement.MdsClient.Client;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.MdsClient.Models.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

public class RegisterCaseTest
{
    private readonly Mock<ILogger<RegisterCase>> _loggerMock;
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Mock<IRequestValidator> _requestValidatorMock;
    private readonly Fixture _fixture;
    private readonly RegisterCase _function;

    public RegisterCaseTest()
    {
        _loggerMock = new Mock<ILogger<RegisterCase>>();
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _requestValidatorMock = new Mock<IRequestValidator>();
        _fixture = new Fixture();
        _function = new RegisterCase(_loggerMock.Object, _mdsServiceMock.Object, _mdsArgFactoryMock.Object, _requestValidatorMock.Object);
    }

    [Fact]
    public async Task Run_InvalidRequest_ReturnsBadRequest()
    {
        // Arrange
        var validationErrors = new[] { "err1", "err2" }.ToList();
        var caseDetails = _fixture.Create<CaseRegistrationRequest>();
        var correlationId = _fixture.Create<Guid>();

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = false,
                ValidationErrors = validationErrors,
                Value = caseDetails
            });

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(validationErrors.Count, ((IEnumerable<string>)badRequest!.Value!).Count());
    }

    [Fact]
    public async Task Run_MdsException_PropagatesToMiddleware()
    {
        // Arrange
        var caseDetails = CreateValidCaseRegistrationRequest();
        var correlationId = _fixture.Create<Guid>();

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = true,
                Value = caseDetails
            });

        _mdsServiceMock.Setup(x => x.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()))
            .ThrowsAsync(new Exception("Error"));

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        var exception = await Assert.ThrowsAsync<Exception>(() => _function.Run(httpRequest, functionContext));

        Assert.Equal("Error", exception.Message);
        _mdsServiceMock.Verify(c => c.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()), Times.Once);
        _requestValidatorMock.Verify(v => v.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()), Times.Once);
    }

    [Fact]
    public async Task Run_WithValidRequest_ReturnsOkObjectResult()
    {
        // Arrange
        var caseDetails = CreateValidCaseRegistrationRequest();
        var correlationId = _fixture.Create<Guid>();

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = true,
                Value = caseDetails
            });

        _mdsServiceMock.Setup(x => x.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()))
            .ReturnsAsync(new CaseRegistrationResponseDto { CaseId = 12345 });

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        _mdsArgFactoryMock.Verify(f => f.CreateRegisterCaseArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<CaseRegistrationRequest>()), Times.Once);
        _mdsServiceMock.Verify(c => c.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()), Times.Once);
    }

    [Fact]
    public async Task Run_WithValidRequest_NormalizesDefendantsBeforeForwarding()
    {
        // Arrange
        var caseDetails = CreateValidCaseRegistrationRequest();
        caseDetails.Defendants!.First().Gender = string.Empty;
        var correlationId = _fixture.Create<Guid>();

        CaseRegistrationRequest? capturedRequest = null;
        _mdsArgFactoryMock
            .Setup(f => f.CreateRegisterCaseArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<CaseRegistrationRequest>()))
            .Callback<string, Guid, CaseRegistrationRequest>((_, _, request) => capturedRequest = request);

        _requestValidatorMock
            .Setup(x => x.GetJsonBody<CaseRegistrationRequest, CaseRegistrationRequestValidator>(It.IsAny<HttpRequest>()))
            .ReturnsAsync(new ValidatableRequest<CaseRegistrationRequest>
            {
                IsValid = true,
                Value = caseDetails
            });

        _mdsServiceMock.Setup(x => x.RegisterCaseAsync(It.IsAny<MdsRegisterCaseArg>()))
            .ReturnsAsync(new CaseRegistrationResponseDto { CaseId = 12345 });

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = CreateHttpRequestFromJson(caseDetails, correlationId);

        // Act
        await _function.Run(httpRequest, functionContext);

        // Assert
        Assert.NotNull(capturedRequest);
        var defendant = Assert.Single(capturedRequest!.Defendants!);
        Assert.Equal(CaseRegistrationDefaults.Gender, defendant.Gender);
    }

    private static HttpRequest CreateHttpRequestFromJson(object obj, Guid correlationId)
    {
        var req = HttpRequestStubHelper.CreateHttpRequest(correlationId);
        req.ContentType = "application/json";
        if (obj != null)
        {
            var json = JsonSerializer.Serialize(obj);
            var bytes = Encoding.UTF8.GetBytes(json);
            req.Body = new MemoryStream(bytes);
            req.Body.Position = 0;
        }
        else
        {
            req.Body = new MemoryStream();
        }
        return req;
    }

    private static CaseRegistrationRequest CreateValidCaseRegistrationRequest()
    {
        return new CaseRegistrationRequest
        {
            Urn = new CaseRegistrationUrn
            {
                UniqueRef = "12345",
                Year = 30,
                PoliceForce = "AA",
                PoliceUnit = "BB"
            },
            RegisteringAreaId = 1,
            RegisteringUnitId = 2,
            Defendants = new List<CaseRegistrationDefendant>
            {
                new CaseRegistrationDefendant
                {
                    IsDefendant = true,
                    Surname = "Smith",
                    Charges = new List<CaseRegistrationCharge>
                    {
                        new CaseRegistrationCharge
                        {
                            OffenceCode = "CODE1",
                            OffenceDescription = "Description",
                            OffenceId = "ID1",
                            DateFrom = DateTime.Today,
                            Comment = "Comment"
                        }
                    }
                }
            },
            MonitoringCodes = new List<CaseRegistrationMonitoringCode>
            {
                new CaseRegistrationMonitoringCode("MON1", true)
            }
        };
    }
}
