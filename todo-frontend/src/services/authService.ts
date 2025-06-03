import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' }
});

export const register = async (username: string, email: string, password: string) => {
  const response = await authApi.post('/register', { username, email, password });
  return response.data.token;
};

export const login = async (email: string, password: string) => {
  const response = await authApi.post('/login', { email, password });
  return response.data.token;
};
