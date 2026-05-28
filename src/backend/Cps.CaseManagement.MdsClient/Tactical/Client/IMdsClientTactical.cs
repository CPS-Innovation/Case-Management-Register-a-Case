using Cps.CaseManagement.MdsClient.Tactical.Models.Response;

namespace Cps.CaseManagement.MdsClient.Tactical.Client;

public interface IMdsClientTactical
{
    Task<AuthenticationResponse> AuthenticateAsync(string username, string password);
}