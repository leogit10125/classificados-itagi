// src/services/statsService.js
// 👇 MUDE AQUI: 5000 → 3000
const API_URL = 'http://localhost:3000/api';

export const getStats = async () => {
  try {
    // Busca do SEU backend, não do Firebase
    const response = await fetch(`${API_URL}/stats`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      anuncios: data.anuncios || 0,
      usuarios: data.usuarios || 0,
      categorias: data.categorias || 0
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return {
      anuncios: 0,
      usuarios: 0,
      categorias: 0
    };
  }
};