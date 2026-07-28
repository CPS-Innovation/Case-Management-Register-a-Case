namespace Cps.CaseManagement.Api.Exceptions;

[Serializable]
public class CmsAuthValuesException : Exception
{
    public CmsAuthValuesException()
        : base("Invalid Cms-Auth-Values. The CMS authentication cookie is missing or malformed.")
    {
    }
}
