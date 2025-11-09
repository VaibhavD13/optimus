import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // send cookies
  headers: { 'Content-Type': 'application/json' }
});

export default api;