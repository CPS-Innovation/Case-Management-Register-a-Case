namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

using Microsoft.AspNetCore.Mvc;
using Moq;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.MdsClient.Exceptions;
using System.Net;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.Api.Models.Dto;

public class GetUrnExistsTests
{
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly GetUrnExists _function;
    private readonly Guid _correlationId;
    private readonly string _cmsAuthValues;
    private readonly string _urn;
    private readonly MdsUrnArg _getByUrnArg;

    public GetUrnExistsTests()
    {
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new GetUrnExists(_mdsServiceMock.Object, _mdsArgFactoryMock.Object);

        _correlationId = _fixture.Create<Guid>();
        _cmsAuthValues = _fixture.Create<string>();
        _urn = _fixture.Create<string>();
        _getByUrnArg = _fixture.Create<MdsUrnArg>();
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithTrue_WhenUrnExists()
    {
        // Arrange
        var cases = _fixture.Create<CaseInfoDto[]>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUrnArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(_getByUrnArg);

        _mdsServiceMock
            .Setup(c => c.ListCasesByUrnAsync(_getByUrnArg))
            .ReturnsAsync(cases);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(_correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(_correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext, _urn);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        Assert.True((bool)okResult.Value);
        _mdsServiceMock.Verify(c => c.ListCasesByUrnAsync(_getByUrnArg), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithFalse_WhenUrnDoesNotExist()
    {
        // Arrange
        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUrnArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(_getByUrnArg);

        _mdsServiceMock
            .Setup(c => c.ListCasesByUrnAsync(_getByUrnArg))
            .ReturnsAsync(Array.Empty<CaseInfoDto>());

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(_correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(_correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext, _urn);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        Assert.False((bool)okResult.Value);
        _mdsServiceMock.Verify(c => c.ListCasesByUrnAsync(_getByUrnArg), Times.Once);
    }

    [Fact]
    public async Task Run_ThrowsMdsClientException_WhenUrnIsInvalid()
    {
        // Arrange
        var invalidUrn = "123";

        _mdsArgFactoryMock
            .Setup(f => f.CreateGetByUrnArg(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(_getByUrnArg);

        _mdsServiceMock
            .Setup(c => c.ListCasesByUrnAsync(_getByUrnArg))
            .ThrowsAsync(new MdsClientException(HttpStatusCode.BadRequest, new HttpRequestException("Invalid URN format")));

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            _correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(_correlationId);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<MdsClientException>(
            async () => await _function.Run(httpRequest, functionContext, invalidUrn));

        Assert.Equal(HttpStatusCode.BadRequest, exception.StatusCode);
        _mdsServiceMock.Verify(c => c.ListCasesByUrnAsync(_getByUrnArg), Times.Once);
    }
}