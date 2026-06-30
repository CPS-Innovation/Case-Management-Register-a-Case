using Cps.CaseManagement.Infrastructure.Extensions;
using Xunit;

namespace Cps.CaseManagement.Infrastructure.Tests.Unit.Extensions;

public class ListExtensionsTests
{
    [Fact]
    public void GetDictionaryKeyValue_WithMatchingKey_ReturnsFirstValue()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "key1", "value1" }, { "key2", "value2" } },
            new Dictionary<string, object> { { "key1", "value3" }, { "key3", "value4" } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("key1");

        // Assert
        Assert.Equal("value1", result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithNonExistentKey_ReturnsNull()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "key1", "value1" } },
            new Dictionary<string, object> { { "key2", "value2" } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("nonExistentKey");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithEmptyList_ReturnsNull()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>();

        // Act
        var result = list.GetDictionaryKeyValue("anyKey");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithNullList_ReturnsNull()
    {
        // Arrange
        List<Dictionary<string, object>>? list = null;

        // Act
        var result = list!.GetDictionaryKeyValue("anyKey");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithMultipleMatchingKeys_ReturnsFirstMatch()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "key1", "firstValue" } },
            new Dictionary<string, object> { { "key1", "secondValue" } },
            new Dictionary<string, object> { { "key1", "thirdValue" } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("key1");

        // Assert
        Assert.Equal("firstValue", result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithIntegerValue_ReturnsStringRepresentation()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "numKey", 42 } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("numKey");

        // Assert
        Assert.Equal("42", result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithBooleanValue_ReturnsStringRepresentation()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "boolKey", true } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("boolKey");

        // Assert
        Assert.Equal("True", result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithNullValue_ReturnsNull()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "nullKey", null! } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("nullKey");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithComplexObject_ReturnsToStringRepresentation()
    {
        // Arrange
        var customObject = new { Name = "Test", Value = 123 };
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "objectKey", customObject } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("objectKey");

        // Assert
        Assert.NotNull(result);
        Assert.Contains("Name", result.ToString());
    }

    [Fact]
    public void GetDictionaryKeyValue_WithEmptyStringKey_ReturnsNull()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "key1", "value1" } }
        };

        // Act
        var result = list.GetDictionaryKeyValue(string.Empty);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithEmptyDictionaries_ReturnsNull()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object>(),
            new Dictionary<string, object>()
        };

        // Act
        var result = list.GetDictionaryKeyValue("anyKey");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithMixedDictionaries_ReturnsFirstMatch()
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "otherKey", "otherValue" } },
            new Dictionary<string, object>(), // Empty dictionary
            new Dictionary<string, object> { { "targetKey", "foundValue" } },
            new Dictionary<string, object> { { "targetKey", "notFoundValue" } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("targetKey");

        // Assert
        Assert.Equal("foundValue", result);
    }

    [Theory]
    [InlineData("key1")]
    [InlineData("KEY1")]
    public void GetDictionaryKeyValue_IsCaseSensitive(string searchKey)
    {
        // Arrange
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "key1", "lowercase" } },
            new Dictionary<string, object> { { "KEY1", "uppercase" } }
        };

        // Act
        var result = list.GetDictionaryKeyValue(searchKey);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public void GetDictionaryKeyValue_WithDateTimeValue_ReturnsStringRepresentation()
    {
        // Arrange
        var dateTime = new DateTime(2025, 11, 5, 10, 30, 0);
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "dateKey", dateTime } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("dateKey");

        // Assert
        Assert.NotNull(result);
        Assert.Contains("2025", result.ToString());
    }

    [Fact]
    public void GetDictionaryKeyValue_WithGuidValue_ReturnsStringRepresentation()
    {
        // Arrange
        var guid = Guid.NewGuid();
        var list = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "guidKey", guid } }
        };

        // Act
        var result = list.GetDictionaryKeyValue("guidKey");

        // Assert
        Assert.Equal(guid.ToString(), result);
    }
}