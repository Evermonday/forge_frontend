import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json'
    }
});

apiClient
  .interceptors
  .request
  .use(request => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`,
      request.headers['Accept'] = 'application/json',
      request.headers['Content-Type'] = 'application/json'
    }
    return request;
  }, error => {
    return Promise.reject(error);
  });

export const registerApi = registerData => apiClient.post('register', registerData);
export const loginApi = loginData => apiClient.post('login', loginData);
export const logoutApi = () => apiClient.post('logout');

export const getUserApi = () => apiClient.get('user');

export const updateTagApi = (tagId, newTagName) =>
    apiClient.put(
      `tag/${tagId}`,
      {name: newTagName}
    );
export const getTagApi = () => apiClient.get('tag');


// Project
export const getProjectApi = () => apiClient.get('project');
export const updateProjectLandAreaApi = landArea => apiClient.put(`project/landArea`, landArea);


// Overview
export const getScenariosApi = () => apiClient.get(`scenario`);
export const getScenarioApi = scenarioId => apiClient.get(`scenario/${scenarioId}`);

//DELETE:
export const createScenarioApi = scenarioCreationData =>
  apiClient.post(
    `scenario`,
    scenarioCreationData
  );
export const createScenarioFromScratchApi = () => apiClient.post('scenario')
export const updateScenarioName = (name, scenarioId) => apiClient.put(`scenario/${scenarioId}/name`, name);
export const updateScenarioNote = (note, scenarioId) => apiClient.put(`scenario/${scenarioId}/note`, note);
export const updateScenarioTag = (tagId, scenarioId) => apiClient.put(`scenario/${scenarioId}/tag`, tagId);
export const updateScenarioDevelopmentType = (developmentType, scenarioId) => apiClient.put(`scenario/${scenarioId}/developmentType`, developmentType);
export const updateScenarioDevelopmentStrategy = (developmentStrategy, scenarioId) => apiClient.put(`scenario/${scenarioId}/developmentStrategy`, developmentStrategy);
export const updateScenarioUnitType = (unitType, scenarioId) => apiClient.put(`scenario/${scenarioId}/unitType`, unitType);
export const updateScenarioEndUse = (endUse, scenarioId) => apiClient.put(`scenario/${scenarioId}/endUse`, endUse);
export const updateScenarioGFACalcMethodApi = (gfaCalcMethod, scenarioId) => apiClient.put(`scenario/${scenarioId}/gfaCalcMethod`, gfaCalcMethod);
export const updateScenarioFSIApi = (fsi, scenarioId) => apiClient.put(`scenario/${scenarioId}/fsi`, fsi);
export const updateScenarioGFAApi = (gfa, scenarioId) => apiClient.put(`scenario/${scenarioId}/gfa`, gfa);

export const updateScenarioAreaAllocMethodApi = (areaAllocMethod, scenarioId) => apiClient.put(`scenario/${scenarioId}/areaAllocMethod`, areaAllocMethod);
export const updateScenarioResidentialGFANumberApi = (residentialGFANumber, scenarioId) => apiClient.put(`scenario/${scenarioId}/residentialGFANumber`, residentialGFANumber);
export const updateScenarioResidentialGFAPercentageApi = (residentialGFAPercentage, scenarioId) => apiClient.put(`scenario/${scenarioId}/residentialGFAPercentage`, residentialGFAPercentage);
export const updateScenarioCommercialGFANumberApi = (commercialGFANumber, scenarioId) => apiClient.put(`scenario/${scenarioId}/commercialGFANumber`, commercialGFANumber);
export const updateScenarioCommercialGFAPercentageApi = (commercialGFAPercentage, scenarioId) => apiClient.put(`scenario/${scenarioId}/commercialGFAPercentage`, commercialGFAPercentage);

export const updateScenarioNFAAreaAllocMethodApi = (nfaAreaAllocMethod, scenarioId) => apiClient.put(`scenario/${scenarioId}/nfaAreaAllocMethod`, nfaAreaAllocMethod);
export const updateScenarioResidentialNFANumberApi = (residentialNFANumber, scenarioId) => apiClient.put(`scenario/${scenarioId}/residentialNFANumber`, residentialNFANumber);
export const updateScenarioResidentialNFAPercentageApi = (residentialNFAPercentage, scenarioId) => apiClient.put(`scenario/${scenarioId}/residentialNFAPercentage`, residentialNFAPercentage);
export const updateScenarioCommercialNFANumberApi = (commercialNFANumber, scenarioId) => apiClient.put(`scenario/${scenarioId}/commercialNFANumber`, commercialNFANumber);
export const updateScenarioCommercialNFAPercentageApi = (commercialNFAPercentage, scenarioId) => apiClient.put(`scenario/${scenarioId}/commercialNFAPercentage`, commercialNFAPercentage);

export const updateTaskDisplayIdsApi = (taskDisplayIds, scenarioId) => apiClient.put(`scenario/${scenarioId}/taskDisplayIds`, taskDisplayIds);
export const createTaskApi = scenarioId => apiClient.post(`scenario/${scenarioId}/task`);

// Schedule
export const getScenarioTasksApi = scenarioId => apiClient.get(`scenario/${scenarioId}/task`);
export const updateStartDateApi = (startDate, scenarioId) => apiClient.put(`scenario/${scenarioId}/startDate`, startDate);


export const updateScenarioApi = (scenarioUpdateData, scenarioId) =>
  apiClient.put(`scenario/${scenarioId}`, scenarioUpdateData);