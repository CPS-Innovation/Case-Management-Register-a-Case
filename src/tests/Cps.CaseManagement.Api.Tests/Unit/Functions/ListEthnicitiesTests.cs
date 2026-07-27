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

public class ListEthnicitiesTests
{
    private readonly Mock<IMdsService> _mdsClientMock;
    private readonly Mock<IMdsArgFactory> _mdsArgFactoryMock;
    private readonly Fixture _fixture;
    private readonly ListEthnicities _function;

    public ListEthnicitiesTests()
    {
        _mdsClientMock = new Mock<IMdsService>();
        _mdsArgFactoryMock = new Mock<IMdsArgFactory>();
        _fixture = new Fixture();
        _function = new ListEthnicities(_mdsClientMock.Object, _mdsArgFactoryMock.Object);
    }

    [Fact]
    public async Task Run_ReturnsOkObjectResult_WithExpectedEthnicities()
    {
        // Arrange
        var expectedEthnicities = _fixture.Create<EthnicityDto[]>();
        var correlationId = _fixture.Create<Guid>();
        var cmsAuthValues = _fixture.Create<string>();
        var baseArg = _fixture.Create<MdsBaseArgDto>();

        _mdsArgFactoryMock
            .Setup(f => f.CreateBaseArg(It.IsAny<string>(), It.IsAny<Guid>()))
            .Returns(baseArg);

        _mdsClientMock
            .Setup(c => c.GetEthnicitiesAsync(baseArg))
            .ReturnsAsync(expectedEthnicities);

        var functionContext = FunctionContextStubHelper.CreateFunctionContextStub(correlationId, _fixture.Create<string>(), _fixture.Create<string>());
        var httpRequest = HttpRequestStubHelper.CreateHttpRequest(correlationId);

        // Act
        var result = await _function.Run(httpRequest, functionContext);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedEthnicities, okResult.Value);
        _mdsClientMock.Verify(c => c.GetEthnicitiesAsync(baseArg), Times.Once);
    }
}
