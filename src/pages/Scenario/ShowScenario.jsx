import { useEffect, useState } from "react";
import { OverviewTab } from "./Tabs/OverviewTab";
import { getScenarioApi, getTagApi, updateScenarioApi } from "../../configs/api";
import { useParams } from "react-router-dom";
import { scenarioInitialState } from "./ScenarioFromScratch";

export default function ShowScenario()
{
  const landArea = 1000
  const { scenarioId } = useParams();
  const [fetchedState, setFetchedState] = useState({
    ...scenarioInitialState,
    statusTag: {'name': '', 'id': 0},
    statusTags: [{'name': '', 'id': 0}],
    landArea,
  });


  useEffect( () => {
    async function fetchData() {
      const tagResponse = await getTagApi();
      const fetchedTags = tagResponse.data

      const scenarioResponse = await getScenarioApi(scenarioId)
      const fetchedScenario = scenarioResponse.data;

      setFetchedState({
        ...fetchedState,
        ...fetchedScenario,
        statusTag: fetchedScenario.tag,
        statusTags: fetchedTags
      });
    }

    fetchData();
  }, [scenarioId])

  async function handleScenarioSave(state)
  {
    delete state.measurementUnit;
    delete state.statusTags;
    state.tag_id = state.statusTag.id
    delete state.statusTag
    const response = await updateScenarioApi(state, scenarioId)
  }

  return (
    <OverviewTab
      initialState={fetchedState}
      handleScenarioSave={handleScenarioSave}
    />
  )
}