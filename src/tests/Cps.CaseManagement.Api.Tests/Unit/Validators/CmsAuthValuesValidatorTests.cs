namespace Cps.CaseManagement.Api.Tests.Unit.Validators;

using System.Text.Json;
using Cps.CaseManagement.Api.Exceptions;
using Cps.CaseManagement.Api.Validators;
using Xunit;

public class CmsAuthValuesValidatorTests
{
    private const string ValidCookies =
        "CMSUSER103883=abc; ASP.NET_SessionId=session123; .CMSAUTH=authvalue; WindowID=MASTER; UID=103883";

    private static readonly string ValidToken = Guid.NewGuid().ToString();

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_Throws_WhenSourceIsNullOrWhitespace(string? source)
    {
        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate(source));
    }

    [Fact]
    public void Validate_Throws_WhenSourceIsInvalidJson()
    {
        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate("{ not-json"));
    }

    [Fact]
    public void Validate_Throws_WhenSourceIsJsonNull()
    {
        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate("null"));
    }

    [Fact]
    public void Validate_Throws_WhenCookiesMissing()
    {
        var source = JsonSerializer.Serialize(new { Token = ValidToken });

        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate(source));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_Throws_WhenCookiesAreNullOrWhitespace(string? cookies)
    {
        var source = Serialize(cookies, ValidToken);

        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate(source));
    }

    [Theory]
    [InlineData("CMSUSER103883=abc; .CMSAUTH=authvalue")]
    [InlineData("ASP.NET_SessionId=session123; .CMSAUTH=authvalue")]
    [InlineData("CMSUSER103883=abc; ASP.NET_SessionId=session123")]
    public void Validate_Throws_WhenRequiredCookieTokenMissing(string cookies)
    {
        var source = Serialize(cookies, ValidToken);

        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate(source));
    }

    [Fact]
    public void Validate_Accepts_CmsUserWithoutNumericUserId()
    {
        var cookies = "CMSUSER=; ASP.NET_SessionId=session123; .CMSAUTH=authvalue";
        var source = Serialize(cookies, ValidToken);

        var result = CmsAuthValuesValidator.Validate(source);

        Assert.Equal(cookies, result.Cookies);
        Assert.Equal(ValidToken, result.Token);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("not-a-guid")]
    [InlineData("00000000-0000-0000-0000-000000000000")]
    public void Validate_Throws_WhenTokenIsInvalid(string? token)
    {
        var source = Serialize(ValidCookies, token);

        Assert.Throws<CmsAuthValuesException>(() => CmsAuthValuesValidator.Validate(source));
    }

    [Fact]
    public void Validate_Accepts_ValidPayload()
    {
        var source = Serialize(ValidCookies, ValidToken);

        var result = CmsAuthValuesValidator.Validate(source);

        Assert.Equal(ValidCookies, result.Cookies);
        Assert.Equal(ValidToken, result.Token);
    }

    [Fact]
    public void Validate_Accepts_PayloadWithExpiryTimeAndDynatraceCookies()
    {
        var cookies =
            $"{ValidCookies}; dtCookie=v_0; rxVisitor=abc; dtPC=3; rxvt=1; dtSa=-; dtLatC=1; C-CIN3-LBsessioncookie=!r";
        var source = JsonSerializer.Serialize(new
        {
            Cookies = cookies,
            Token = ValidToken,
            ExpiryTime = DateTimeOffset.UtcNow.AddHours(1)
        });

        var result = CmsAuthValuesValidator.Validate(source);

        Assert.Equal(cookies, result.Cookies);
        Assert.Equal(ValidToken, result.Token);
    }

    private static string Serialize(string? cookies, string? token) =>
        JsonSerializer.Serialize(new { Cookies = cookies, Token = token });
}
