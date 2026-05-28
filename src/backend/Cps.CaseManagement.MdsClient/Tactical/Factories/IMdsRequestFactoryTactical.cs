namespace Cps.CaseManagement.MdsClient.Tactical.Factories;

public interface IMdsRequestFactoryTactical
{
    HttpRequestMessage CreateAuthenticateRequest(string username, string password);
}