import { act, createContext, useContext, useReducer } from 'react';
import Decimal from 'decimal.js';

const ScenarioContext = createContext(null);

const ScenarioDispatchContext = createContext(null);

export function ScenarioProvider({ children }) {
  const [scenario, dispatch] = useReducer(scenarioReducer, initialSenario);

  return (
    <ScenarioContext.Provider value={scenario}>
      <ScenarioDispatchContext.Provider value={dispatch}>
        {children}
      </ScenarioDispatchContext.Provider>
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  return useContext(ScenarioContext);
}

export function useScenarioDispatch() {
  return useContext(ScenarioDispatchContext);
}

function scenarioReducer(scenario, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      switch (action.field) {
        case 'gfa_calc_method':
          if (action.value == 'FSI based') {
            const gfa = new Decimal(scenario.land_area).times(scenario.fsi);
            console.log('gfa', scenario.land_area, 'fsi', scenario.fsi);
            return { ...scenario, gfa_calc_method: action.value, gfa: gfa };
          } else {
            //  if (action.value == "Manual")
            return { ...scenario, gfa_calc_method: action.value };
          }

        case 'fsi':
          if (scenario.gfa_calc_method == 'FSI based') {
            const gfa = new Decimal(scenario.land_area).times(action.value);
            console.log('fsi', action.value, 'gfa', gfa);
            return { ...scenario, fsi: action.value, gfa: gfa };
          } else {
            //  if (action.value == "Manual")
            return { ...scenario, fsi: action.value };
          }
        case 'land_area': // Fields that require calculation are handled in the cases of this switch statement
          if (scenario.gfa_calc_method == 'FSI based') {
            const gfa = new Decimal(action.value).times(scenario.fsi);
            return { ...scenario, land_area: action.value, gfa: gfa };
          } else {
            //  if (action.value == "Manual")
            return { ...scenario, land_area: action.value };
          }

        case 'end_use':
          if (action.value == 'Residential') {
            return {
              ...scenario,
              end_use: action.value,
              residential_gfa_percentage: 100,
              residential_gfa_number: scenario.gfa,
              commercial_gfa_number: 0,
              commercial_gfa_percentage: 0,
              commercial_nfa_number: 0,
              commercial_nfa_percentage: 0,
            };
          } else if (action.value == 'Commercial') {
            return {
              ...scenario,
              end_use: action.value,
              commercial_gfa_percentage: 100,
              commercial_gfa_number: scenario.gfa,
              residential_gfa_number: 0,
              residential_gfa_percentage: 0,
              residential_nfa_number: 0,
              residential_nfa_percentage: 0,
            };
          } else {
            return {
              ...scenario,
              end_use: action.value,
            };
          }
        default:
          return { ...scenario, [action.field]: action.value };
      }
      //return scenario;
    }
    case 'deleted': {
      return scenario.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialSenario = {
  name: '',
  note: '',
  status: '',
  development_type: '',
  development_strategy: '',
  unit_type: '',
  gfa_calc_method: '',
  fsi: new Decimal(0),
  land_area: new Decimal(0),
  gfa: new Decimal(0),
  residential_gfa_number: new Decimal(0),
  commercial_gfa_number: new Decimal(0),
  residential_gfa_percentage: '',
  commercial_gfa_percentage: '',
  residential_nfa_number: new Decimal(0),
  commercial_nfa_number: new Decimal(0),
  residential_nfa_percentage: '',
  commercial_nfa_percentage: '',
};
