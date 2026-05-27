namespace Cps.CaseManagement.MdsClient.Tactical.Factories;

public class MdsRequestFactoryTactical : IMdsRequestFactoryTactical
{
    public HttpRequestMessage CreateAuthenticateRequest(string username, string password)
    {
        return new HttpRequestMessage(HttpMethod.Post, "api/authenticate")
        {
            Content = new FormUrlEncodedContent([
                    new ("username", username),
                    new ("password", password)
                ])
        };
    }
}