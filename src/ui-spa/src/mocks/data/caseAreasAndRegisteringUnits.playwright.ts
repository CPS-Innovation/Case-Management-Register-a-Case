export const caseAreasAndRegisteringUnitsPlaywright = {
  allUnits: [
    {
      areaId: 1007,
      areaDescription: "Cheshire",
      areaIsSensitive: false,
      id: 2026,
      description: "Warrington MCU",
    },
    {
      areaId: 1007,
      areaDescription: "Cheshire",
      areaIsSensitive: false,
      id: 2027,
      description: "Warrington CCU",
    },
    {
      areaId: 1007,
      areaDescription: "Cheshire",
      areaIsSensitive: false,
      id: 2028,
      description: "Chester MCU",
    },
    {
      areaId: 1007,
      areaDescription: "Cheshire",
      areaIsSensitive: false,
      id: 2029,
      description: "Chester CCU",
    },
    {
      areaId: 1007,
      areaDescription: "Cheshire",
      areaIsSensitive: false,
      id: 2030,
      description: "Crewe MCU",
    },
    {
      areaId: 1007,
      areaDescription: "Cheshire",
      areaIsSensitive: false,
      id: 2031,
      description: "Area Secretariat",
    },
    {
      areaId: 1008,
      areaDescription: "CAMBRIDGESHIRE",
      areaIsSensitive: false,
      id: 2032,
      description: "NORTHERN CJU (Peterborough)",
    },
    {
      areaId: 1008,
      areaDescription: "CAMBRIDGESHIRE",
      areaIsSensitive: false,
      id: 2033,
      description: "SOUTHERN CJU (Cambridge)",
    },
    {
      areaId: 1008,
      areaDescription: "CAMBRIDGESHIRE",
      areaIsSensitive: false,
      id: 2034,
      description: "SOUTHERN CJU (Huntingon)",
    },
    {
      areaId: 1008,
      areaDescription: "CAMBRIDGESHIRE",
      areaIsSensitive: false,
      id: 2035,
      description: "CAMBRIDGESHIRE TRIALS UNIT",
    },
    {
      areaId: 1009,
      areaDescription: "West Midlands",
      areaIsSensitive: false,
      id: 2036,
      description: "Birmingham Trials Unit",
    },
  ],
  homeUnit: {
    areaId: 1008,
    areaDescription: "CAMBRIDGESHIRE",
    areaIsSensitive: false,
    id: 2033,
    description: "SOUTHERN CJU (Cambridge)",
  },
};

export const caseAreasAndRegisteringUnitsSensitiveCasePlaywright = {
  ...caseAreasAndRegisteringUnitsPlaywright,
  homeUnit: {
    areaId: 1008,
    areaDescription: "CAMBRIDGESHIRE",
    areaIsSensitive: true,
    id: 2033,
    description: "SOUTHERN CJU (Cambridge)",
  },
};
