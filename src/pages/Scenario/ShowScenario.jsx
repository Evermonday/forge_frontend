import { Suspense, useEffect, useState } from "react";
import { GeneralTab } from "./Tabs/GeneralTab";
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

//   useEffect(() => {
//     async function fetchScenario() {

// console.log('dooor')
// const newState = {...fetchedState, statusTag: fetchedData.tag, ...fetchedData}
// console.log(fetchedData.tag)
// console.log(newState)

//       setFetchedState(prevState => ({...prevState, statusTag: fetchedData.tag, ...fetchedData}))
//     }

//     fetchScenario();
//   }, [scenarioId])


  async function handleScenarioSave(state)
  {
    delete state.measurementUnit;
    delete state.statusTags;
    state.tag_id = state.statusTag.id
    delete state.statusTag
    const response = await updateScenarioApi(state, scenarioId)
  }

    return (
        <GeneralTab
          initialState={fetchedState}
          handleScenarioSave={handleScenarioSave}
      />
    )
}