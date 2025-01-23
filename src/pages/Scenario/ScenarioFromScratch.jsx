import { useEffect, useState } from "react";
import { GeneralTab } from "./Tabs/GeneralTab";
import { createScenarioApi, getTagApi } from "../../configs/api";
import {
  AREA_ALLOC_METHODS,
  DEVELOPMENT_STRATEGIES,
  DEVELOPMENT_TYPES,
  END_USES,
  GFA_CALC_METHODS,
  MEASUREMENT_UNITS,
  NFA_AREA_ALLOC_METHODS,
  UNIT_TYPES
} from "../../constants/GeneralTab";
import Decimal from "decimal.js";

export const scenarioInitialState = {
  measurementUnit: MEASUREMENT_UNITS[0],
  name: 'Scenario',
  note: '',
  developmentType: DEVELOPMENT_TYPES[0],
  developmentStrategy: DEVELOPMENT_STRATEGIES[0],
  unitType: UNIT_TYPES[0],
  endUse: END_USES[0],
  landArea: 0,
  fsi: new Decimal(1),
  gfa: new Decimal(0),
  gfaCalcMethod: GFA_CALC_METHODS[0],
  areaAllocMethod: AREA_ALLOC_METHODS[0],
  residentialGFANumber: new Decimal(0),
  residentialGFAPercentage: new Decimal(0),
  commercialGFANumber: new Decimal(0),
  commercialGFAPercentage: new Decimal(0),
  nfaAreaAllocMethod: NFA_AREA_ALLOC_METHODS[0],
  residentialNFANumber: new Decimal(0),
  residentialNFAPercentage: new Decimal(0),
  commercialNFANumber: new Decimal(0),
  commercialNFAPercentage:  new Decimal(0),
}

export default function ScenarioFromScratch(){
  const [statusTags, setStatusTags] = useState([{'name': '', 'id': 0}])

  useEffect( () => {
    async function fetchTags() {
      const response = await getTagApi();
      const fetchedTags = response.data
      setStatusTags(fetchedTags);
    }

    fetchTags();
  }, [])


  const statusTag = statusTags[0];

  async function handleScenarioSave(state)
  {
    delete state.measurementUnit;
    delete state.statusTags;
    state.tag_id = state.statusTag.id
    delete state.statusTag
    const response = await createScenarioApi(state)
  }
  
  return (
    <GeneralTab
      initialState={{...scenarioInitialState, statusTag, statusTags}}
      handleScenarioSave={handleScenarioSave}
    />
  )
}