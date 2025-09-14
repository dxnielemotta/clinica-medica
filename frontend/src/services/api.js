
import axios from 'axios';
import { useUserStore } from '@/stores/user'; 

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // url base do backend
});

// roda antes de cada requisição ser enviada
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token; // pega o token da store do Pinia

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;