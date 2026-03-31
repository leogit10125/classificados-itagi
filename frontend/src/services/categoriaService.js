const API_URL = 'http://localhost:3000/api';

export const getCategorias = async () => {
  console.log('📡 getCategorias: chamando API...');
  try {
    const response = await fetch(`${API_URL}/categorias`);
    console.log('📡 getCategorias: response status:', response.status);
    
    if (!response.ok) throw new Error('Erro ao buscar categorias');
    
    const data = await response.json();
    console.log('📡 getCategorias: dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('❌ getCategorias: erro:', error);
    return [];
  }
};

export const getAnunciosPorCategoria = async (categoria) => {
  try {
    const response = await fetch(`${API_URL}/categorias/${categoria}`);
    if (!response.ok) throw new Error('Erro ao buscar anúncios');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
};