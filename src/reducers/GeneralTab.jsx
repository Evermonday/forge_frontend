import Decimal from "decimal.js";

export function scenarioReducer(state, action) {
   console.log(action)
   console.log(state)
    switch (action.type) {
        case 'RESET_FIELDS':
            return action.payload;
        case 'SET_SCENARIO_NAME':
            return {...state, scenarioName: action.payload}
        case 'SET_SCENARIO_NOTE':
            return {...state, scenarioNote: action.payload}
        case 'SET_SCENARIO_TAG':
            return {...state, scenarioStatusTag: action.payload}
        case 'SET_SCENARIO_DEVELOPMENT_TYPE':
            return {...state, developmentType: action.payload}
        case 'SET_SCENARIO_DEVELOPMENT_STRATEGY':
            return {...state, developmentStrategy: action.payload}
        case 'SET_SCENARIO_UNIT_TYPE':
            return {...state, unitType: action.payload}
        case 'SET_SCENARIO_LAND_AREA':
        {
            const landArea = action.payload;
            const gfa = new Decimal(landArea).times(state.fsi);
            return {...state, landArea, gfa}
        }
        case 'SET_SCENARIO_GFA_CALC_METHOD':
            return {...state, gfaCalcMethod: action.payload}
        case 'SET_SCENARIO_GFA':
        {
            const gfa = action.payload;
            const fsi = new Decimal(state.landArea).dividedBy(gfa)
            return {...state, gfa, fsi}
        }
        case 'SET_SCENARIO_AREA_ALLOC_METHOD': {
            const areaAllocMethod = action.payload;
            // if (areaAllocMethod == 'FSI-Based')
            // {
                
            // }
            return {...state, areaAllocMethod}
        }
        case 'SET_SCENARIO_RESIDENTIAL_GFA_NUMBER':
            return {...state, residentialGFANumber: action.payload}
        case 'SET_SCENARIO_FSI': {
            // if (state.gfaCalcMethod == 'FSI-Based')
            // {
            const fsi = action.payload;
            const gfa =  new Decimal(state.landArea).times(state.fsi);
            return {...state, fsi, gfa}
            // }
            // else if (state.gfaCalcMethod == 'manual')
            // {
            //     const fsi
            // }
        }
        case 'SET_SCENARIO_END_USE':
            if (action.payload == 'Residential') {
                return {
                    ...state,
                    endUse: 'Residential',
                    residentialGFAPercentage: 100,
                    residentialGFANumber: state.gfa,
                    // residentialNFANumber: 0,
                    // residentialNFAPercentage: 0,
                    commercialGFANumber: 0,
                    commercialGFAPercentage: 0,
                    commercialNFANumber: 0,
                    commercialNFAPercentage: 0,
                };
            } else if (action.payload == 'Commercial') {
                return {
                    ...state,
                    endUse: 'Commercial',
                    residentialGFAPercentage: 0,
                    residentialGFANumber: 0,
                    residentialNFANumber: 0,
                    residentialNFAPercentage: 0,
                    commercialGFANumber: state.gfa,
                    commercialGFAPercentage: 100,
                    // commercialNFANumber: 0,
                    // commercialNFAPercentage: 0,
                };
            } else {
                return {
                    ...state,
                    endUse: action.payload,
                };
            }
        //return state;
        // case 'deleted': {
        //     return state.filter((t) => t.id !== action.id);
        // }
        default: {
        throw Error('Unknown action: ' + action.type);
        }
    }
}
  
// export const initialSenario = {
//     name: '',
//     note: '',
//     status: '',
//     development_type: '',
//     development_strategy: '',
//     unit_type: '',
//     gfa_calc_method: '',
//     fsi: new Decimal(0),
//     land_area: new Decimal(0),
//     gfa: new Decimal(0),
//     residentialGFANumber: new Decimal(0),
//     commercialGFANumber: new Decimal(0),
//     residentialGFAPercentage: '',
//     commercialGFAPercentage: '',
//     residentialNFANumber: new Decimal(0),
//     commercialNFANumber: new Decimal(0),
//     residentialNFAPercentage: '',
//     commercialNFAPercentage: '',
// };
