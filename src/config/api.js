import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8181/',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json'
    }
});

// const previligedApi = apiClient.get('api/', {
//   headers: {
//     Authorization: `Bearer ${token}`,
//     Accept: 'application/json',
//     "Content-Type": 'application/json'
//   }
// });


export const registerApi = registerData => apiClient.post('api/register', registerData);
export const loginApi = loginData => apiClient.post('api/login', loginData);
export const getUserApi = token =>
    apiClient.get('api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        "Content-Type": 'application/json'
      }
    });

// export const getSanctumApi = () => apiClient.get('sanctum/csrf-cookie');

export const logoutApi = token =>
  apiClient.post('api/logout', null, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      "Content-Type": 'application/json'
    }
  });