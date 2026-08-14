namespace Cps.CaseManagement.Api.Mappers;

using Cps.CaseManagement.Api.Constants;
using Cps.CaseManagement.Api.Models.Dto;
using Cps.CaseManagement.MdsClient.Models.Entities;
using Microsoft.Extensions.Logging;

public class MdsMapper(ILogger<MdsMapper> logger) : IMdsMapper
{
    private readonly ILogger<MdsMapper> _logger = logger;
    public UnitsDto MapUnitsAndUserDataToDto(IEnumerable<UnitEntity> allUnits, long? homeUnitId)
    {
        return new UnitsDto
        {
            AllUnits = allUnits.ToList(),
            HomeUnit = homeUnitId is not null ? allUnits.FirstOrDefault(u => u.Id == homeUnitId) : null
        };
    }

    public TitleDto MapTitleEntityToDto(TitleEntity entity)
    {
        return new TitleDto
        {
            ShortCode = entity.ShortCode,
            Description = ReferenceDataDescriptions.GetTitleDescription(entity.ShortCode),
            Display = ReferenceDataDescriptions.GetTitleDisplayName(entity.ShortCode),
            IsPoliceTitle = entity.IsPoliceTitle
        };
    }

    public ReligionDto MapReligionEntityToDto(ReligionEntity entity)
    {
        return new ReligionDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public GenderDto MapGenderEntityToDto(GenderEntity entity)
    {
        return new GenderDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public EthnicityDto MapEthnicityEntityToDto(EthnicityEntity entity)
    {
        return new EthnicityDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public MonitoringCodeDto MapMonitoringCodeEntityToDto(MonitoringCodeEntity entity)
    {
        return new MonitoringCodeDto
        {
            Code = entity.Code,
            Description = entity.Description,
            Display = ReferenceDataDescriptions.GetMonitoringCodeDisplay(entity.Code, entity.Description)
        };
    }

    public ComplexityDto MapComplexityEntityToDto(ComplexitityEntity entity)
    {
        return new ComplexityDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
        };
    }

    public OffenderCategoryDto MapOffenderCategoryEntityToDto(OffenderCategoryEntity entity)
    {
        return new OffenderCategoryDto
        {
            ShortCode = entity.ShortCode,
            Description = entity.Description,
            Display = ReferenceDataDescriptions.GetOffenderCategoryDisplay(entity.ShortCode)
        };
    }

    public ProsecutorOrCaseworkerDto MapProsecutorOrCaseworkerEntityToDto(ProsecutorOrCaseworkerEntity entity)
    {
        return new ProsecutorOrCaseworkerDto
        {
            Id = entity.Id,
            Description = entity.Description,
        };
    }

    public CourtDto MapCourtEntityToDto(CourtEntity entity)
    {
        return new CourtDto
        {
            Id = entity.Id,
            Description = entity.Description,
        };
    }

    public WMSUnitDto MapWMSUnitEntityToDto(WMSUnitEntity entity)
    {
        return new WMSUnitDto
        {
            AreaId = entity.AreaId,
            AreaDescription = entity.AreaDescription,
            Id = entity.Id,
            Description = entity.Description,
            IsWCU = entity.IsWCU
        };
    }

    public CaseInfoDto MapCaseInfoEntityToDto(CaseInfoEntity entity)
    {
        return new CaseInfoDto
        {
            Urn = entity.Urn,
        };
    }

    public PoliceUnitDto MapPoliceUnitEntityToDto(PoliceUnitEntity entity)
    {
        return new PoliceUnitDto
        {
            UnitId = entity.UnitId,
            UnitDescription = entity.UnitDescription,
            Code = entity.Code,
            Description = entity.Description,
        };
    }

    public OffencesDto MapOffencesEntityToDto(OffencesEntity entity)
    {
        var nullCmsIdOffences = entity.Offences.Where(o => o.CmsId == null);
        foreach (var offence in nullCmsIdOffences)
        {
            _logger.LogWarning("Offence with Code '{Code}' was excluded because CmsId is null", offence.Code);
        }

        var nullModeOfTrialOffences = entity.Offences.Where(o => o.CmsModeOfTrial?.Id == null);
        foreach (var offence in nullModeOfTrialOffences)
        {
            _logger.LogWarning("Offence with Code '{Code}' and CmsId '{CmsId}' was excluded because CmsModeOfTrial.Id is null",
                offence.Code, offence.CmsId);
        }

        var offences = entity.Offences.Where(o => o.CmsId != null && o.CmsModeOfTrial?.Id != null).Select(o => new OffenceDto
        {
            Code = o.Code,
            Description = o.Description,
            Legislation = o.Legislation,
            DPPConsent = o.DPPConsent,
            EffectiveFromDate = o.EffectiveFromDate,
            EffectiveToDate = o.EffectiveToDate,
            ModeOfTrial = o.ModeOfTrial,
            CmsId = o.CmsId,
            CmsModeOfTrialShortCode = CmsModeOfTrialMapper.ToCmsValue(o.CmsModeOfTrial?.Id),
        }).ToArray();

        return new OffencesDto
        {
            Offences = offences,
            Total = offences.Length,
        };
    }

    public CaseRegistrationResponseDto MapCaseRegistrationEntityToDto(CaseRegistrationEntity entity)
    {
        return new CaseRegistrationResponseDto
        {
            CaseId = entity.CaseId,
            Urn = entity.Urn
        };
    }
}
