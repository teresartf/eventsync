import axios from "axios";

const API_BASE = 'http://localhost:3000'; // URL do seu backend Nest

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para incluir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // garante que config.headers é do tipo correto
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});