namespace Cps.CaseManagement.Api.Tests.Unit.Functions;

using Microsoft.AspNetCore.Mvc;
using Moq;
using AutoFixture;
using Cps.CaseManagement.Api.Functions;
using Cps.CaseManagement.MdsClient.Factories;
using Cps.CaseManagement.MdsClient.Models.Args;
using Cps.CaseManagement.Api.Tests.Helpers;
using Cps.CaseManagement.Api.Services;
using Cps.CaseManagement.Api.Models.Dto;

public class ListWMSUnitsTests
{
    private readonly Mock<IMdsService> _mdsServiceMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly ListWMSUnits _function;

    public ListWMSUnitsTests()
    {
        _mdsServiceMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new ListWMSUnits(_mdsServiceMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedWMSUnits_WhenNoFilterProvided()
    {
        // Arrange
        var expectedUnits = _fixture.Create<WMSUnitDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetWMSUnitsAsync(baseArg, null))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetWMSUnitsAsync(baseArg, null), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithWCUUnitsOnly_WhenIsWCUIsTrue()
    {
        // Arrange
        var expectedUnits = _fixture.Create<WMSUnitDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetWMSUnitsAsync(baseArg, true))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "IsWCU", "true" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetWMSUnitsAsync(baseArg, true), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithNonWCUUnitsOnly_WhenIsWCUIsFalse()
    {
        // Arrange
        var expectedUnits = _fixture.Create<WMSUnitDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetWMSUnitsAsync(baseArg, false))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "IsWCU", "false" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetWMSUnitsAsync(baseArg, false), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithAllWMSUnits_WhenIsWCUIsInvalid()
    {
        // Arrange
        var expectedUnits = _fixture.Create<WMSUnitDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetWMSUnitsAsync(baseArg, null))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "IsWCU", "invalid" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetWMSUnitsAsync(baseArg, null), Times.Once);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithAllWMSUnits_WhenIsWCUIsEmpty()
    {
        // Arrange
        var expectedUnits = _fixture.Create<WMSUnitDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsServiceMock
            .Setup(c => c.GetWMSUnitsAsync(baseArg, null))
            .ReturnsAsync(expectedUnits);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(
            correlationId,
            _fixture.Create<string>(),
            _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequestWithQueryParameters(
            new Dictionary<string, string> { { "IsWCU", "" } },
            correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUnits, okResult.Value);
        _mdsServiceMock.Verify(c => c.GetWMSUnitsAsync(baseArg, null), Times.Once);
    }
}