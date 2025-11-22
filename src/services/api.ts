import axios from 'axios';

const api = axios.create({
  // 👇 COLOCAMOS O LINK DIRETO AQUI. SEM VARIÁVEIS.
  // Substitua pelo link do SEU backend se for diferente deste
  baseURL: 'https://infra-escolar-backend.onrender.com', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;