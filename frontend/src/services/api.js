// src/services/api.js

// 1. O ENDEREÇO DA RÁDIO: Onde o seu servidor Docker está ouvindo.
const API_URL = 'http://localhost:3000/api';

export const api = {
  
  /**
   * BUSCAR TODOS OS ANÚNCIOS (Usado na Home)
   */
  getAds: async () => {
    try {
      const response = await fetch(`${API_URL}/ads`);
      if (!response.ok) throw new Error(`Erro no servidor: status ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar anúncios:', error);
      throw error;
    }
  },

  /**
   * ✅ NOVA FUNÇÃO: BUSCAR ANÚNCIOS DO USUÁRIO LOGADO
   * Essa função resolve o "Carregando..." infinito da sua página.
   */
  getAdsByUser: async (userId) => {
    try {
      // Faz a chamada para a rota que criamos no backend: /api/ads/usuario/ID
      const response = await fetch(`${API_URL}/ads/usuario/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar seus anúncios: status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Erro no fetch getAdsByUser:', error);
      throw error;
    }
  },
  
  /**
   * BUSCAR POR CATEGORIA
   */
  getAdsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/ads?category=${category}`);
      if (!response.ok) throw new Error(`Erro ao filtrar: status ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar anúncios por categoria:', error);
      throw error;
    }
  },

  /**
   * CRIAR NOVO ANÚNCIO
   */
  createAd: async (adData, token) => {
    try {
      console.log('📤 Enviando anúncio...', adData); 
      
      const response = await fetch(`${API_URL}/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(adData) 
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Erro ${response.status}`);
      }
      
      return responseData;
    } catch (error) {
      console.error('❌ Erro ao criar anúncio:', error);
      throw error;
    }
  },

  /**
   * TESTE DE CONEXÃO
   */
  testConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/test`);
      return await response.json();
    } catch (error) {
      console.error('❌ Backend inacessível:', error);
      throw error;
    }
  }
};