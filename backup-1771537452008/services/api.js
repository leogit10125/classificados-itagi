// src/services/api.js
const API_URL = 'http://localhost:5000/api'

export const api = {
  // Buscar todos anúncios
  getAds: async () => {
    const response = await fetch(`${API_URL}/ads`)
    return response.json()
  },
  
  // Buscar por categoria
  getAdsByCategory: async (category) => {
    const response = await fetch(`${API_URL}/ads?category=${category}`)
    return response.json()
  },
  
  // Criar anúncio
  createAd: async (adData, token) => {
    const response = await fetch(`${API_URL}/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adData)
    })
    return response.json()
  }
}