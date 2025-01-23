import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const apiClient = axios.create({
    baseURL: 'http://localhost:8181/',
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

export const registerApi = registerData => apiClient.post('api/register', registerData);
export const loginApi = loginData => apiClient.post('api/login', loginData);
export const logoutApi = () => apiClient.post('api/logout');

export const getUserApi = () => apiClient.get('api/user');

export const updateTagApi = (tagId, newTagName) =>
    apiClient.put(
      `api/tag/${tagId}`,
      {name: newTagName}
    );
export const getTagApi = () => apiClient.get('api/tag');


export const getScenariosApi = () => apiClient.get(`api/scenario`);
export const getScenarioApi = scenarioId => apiClient.get(`api/scenario/${scenarioId}`);
export const createScenarioApi = scenarioCreationData =>
  apiClient.post(
    `api/scenario`,
    scenarioCreationData
  );
export const updateScenarioApi = (scenarioUpdateData, scenarioId) =>
  apiClient.put(`api/scenario/${scenarioId}`, scenarioUpdateData);