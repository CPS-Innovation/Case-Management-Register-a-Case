using System.Text;
using System.Text.Json;
using Cps.CaseManagement.Api.Helpers;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;

namespace Cps.CaseManagement.Api.Tests.Unit.Helpers;

public class RequestValidatorTests
{
    private readonly Mock<ILogger<RequestValidator>> _loggerMock;
    private readonly RequestValidator _sut;

    public RequestValidatorTests()
    {
        _loggerMock = new Mock<ILogger<RequestValidator>>();
        _sut = new RequestValidator(_loggerMock.Object);
    }

    #region Invalid JSON tests

    [Fact]
    public async Task GetJsonBody_InvalidJson_ReturnsGenericErrorMessage()
    {
        // Arrange
        var request = CreateRequestWithBody("{ this is not valid json }");

        // Act
        var result = await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Single(result.ValidationErrors);
        Assert.Equal("The request body contains invalid JSON.", result.ValidationErrors[0]);
    }
    [Fact]
    public async Task GetJsonBody_InvalidJson_DoesNotExposeExceptionDetails()
    {
        // Arrange — malformed JSON that always throws JsonException
        var request = CreateRequestWithBody("{\"id\": }");

        // Act
        var result = await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Single(result.ValidationErrors);
        Assert.DoesNotContain("System", result.ValidationErrors[0]);
        Assert.DoesNotContain("Int32", result.ValidationErrors[0]);
        Assert.DoesNotContain("Path", result.ValidationErrors[0]);
        Assert.DoesNotContain("LineNumber", result.ValidationErrors[0]);
        Assert.Equal("The request body contains invalid JSON.", result.ValidationErrors[0]);
    }

    [Fact]
    public async Task GetJsonBody_InvalidJson_LogsWarningWithException()
    {
        // Arrange
        var request = CreateRequestWithBody("not json at all");

        // Act
        await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Request body contained invalid JSON")),
                It.IsAny<JsonException>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GetJsonBody_EmptyBody_ReturnsGenericErrorMessage()
    {
        // Arrange
        var request = CreateRequestWithBody("");

        // Act
        var result = await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Single(result.ValidationErrors);
        // Empty string deserializes to null, which hits the null check
        Assert.Contains(result.ValidationErrors[0], new[] {
            "The request body contains invalid JSON.",
            "Deserialized object is null."
        });
    }

    #endregion

    #region Null deserialization tests

    [Fact]
    public async Task GetJsonBody_NullJsonLiteral_ReturnsNullError()
    {
        // Arrange — "null" is valid JSON but deserializes to null
        var request = CreateRequestWithBody("null");

        // Act
        var result = await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Single(result.ValidationErrors);
        Assert.Equal("Deserialized object is null.", result.ValidationErrors[0]);
    }

    #endregion

    #region Valid JSON tests

    [Fact]
    public async Task GetJsonBody_ValidJson_PassingValidation_ReturnsIsValidTrue()
    {
        // Arrange
        var dto = new TestDto { Id = 1, Name = "Test" };
        var request = CreateRequestWithBody(JsonSerializer.Serialize(dto));

        // Act
        var result = await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        Assert.True(result.IsValid);
        Assert.Empty(result.ValidationErrors);
        Assert.Equal(1, result.Value.Id);
        Assert.Equal("Test", result.Value.Name);
    }

    [Fact]
    public async Task GetJsonBody_ValidJson_FailingValidation_ReturnsValidationErrors()
    {
        // Arrange — Name is required by TestDtoValidator
        var dto = new TestDto { Id = 1, Name = "" };
        var request = CreateRequestWithBody(JsonSerializer.Serialize(dto));

        // Act
        var result = await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.NotEmpty(result.ValidationErrors);
        Assert.Contains("Name is required.", result.ValidationErrors);
    }

    [Fact]
    public async Task GetJsonBody_ValidJson_DoesNotLogWarning()
    {
        // Arrange
        var dto = new TestDto { Id = 1, Name = "Test" };
        var request = CreateRequestWithBody(JsonSerializer.Serialize(dto));

        // Act
        await _sut.GetJsonBody<TestDto, TestDtoValidator>(request);

        // Assert — should not log any warning for valid JSON
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Never);
    }

    #endregion

    #region Helpers

    private static HttpRequest CreateRequestWithBody(string body)
    {
        var context = new DefaultHttpContext();
        var request = context.Request;
        request.Body = new MemoryStream(Encoding.UTF8.GetBytes(body));
        request.ContentType = "application/json";
        return request;
    }

    #endregion

    #region Test DTOs and Validators

    private class TestDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    private class TestDtoValidator : AbstractValidator<TestDto>
    {
        public TestDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Name is required.");
        }
    }

    #endregion
}