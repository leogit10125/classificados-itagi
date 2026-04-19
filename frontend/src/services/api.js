import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = {
  // Buscar todos os anúncios
  getAds: async () => {
    try {
      const response = await axios.get(`${API_URL}/ads`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
      return [];
    }
  },

  // Buscar anúncios por usuário
  getAdsByUser: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/ads/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anúncios do usuário:', error);
      return [];
    }
  },

  // Buscar um anúncio específico
  getAd: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ads/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anúncio:', error);
      return null;
    }
  },

  // Criar anúncio
  createAd: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ads`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      throw error;
    }
  },

  // Deletar anúncio
  deleteAd: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/ads/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar anúncio:', error);
      throw error;
    }
  }
};

export { api };
