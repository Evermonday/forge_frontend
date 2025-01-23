import ReactJsonView from '@microlink/react-json-view';
import { useScenario } from '../../../contexts/ScenarioContext';

export default function JsonPreview() {
  const scenarioData = useScenario();

  return (
    <>
      <ReactJsonView src={scenarioData} />
    </>
  );
}
