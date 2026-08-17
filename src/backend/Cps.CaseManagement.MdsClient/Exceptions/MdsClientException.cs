namespace Cps.CaseManagement.MdsClient.Exceptions;

using System.Net;

public class MdsClientException : Exception
{
    public HttpStatusCode StatusCode { get; private set; }

    public MdsClientException(HttpStatusCode statusCode, HttpRequestException httpRequestException)
        : base($"The HTTP request failed with status code {statusCode}", httpRequestException)
    {
        StatusCode = statusCode;
    }
}
