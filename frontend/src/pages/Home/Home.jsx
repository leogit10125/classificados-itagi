// src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import Hero from '../../components/Hero/Hero';
import Categories from '../../components/Categories/Categories';
import AdsCarousel from '../../components/AdsCarousel/AdsCarousel';
import './Home.css';

const API_URL = 'http://localhost:3000/api';

function Home() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando anúncios...');
      
      const response = await fetch(`${API_URL}/ads`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Anúncios recebidos:', data);
      
      setAnuncios(data);
      setError(null);
    } catch (error) {
      console.error('❌ Erro:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pegar apenas os 6 primeiros para o carrossel
  const anunciosDestaque = anuncios.slice(0, 6);

  // 👇 LOG CORRETO (fora do JSX)
  console.log('🖥️ Renderizando Home - Categories será renderizado');

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <Hero />
      
      {/* CATEGORIAS - APENAS UMA VEZ! */}
      <Categories />
      
      {/* CARROSSEL DE ANÚNCIOS */}
      <section className="featured-ads">
        <div className="container">
          <h2 className="section-title">📢 Anúncios Recentes</h2>
          
          {loading && (
            <div className="loading-state">
              <p>Carregando anúncios...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>❌ Erro de Conexão</p>
              <p>O backend está rodando? Verifique o terminal.</p>
              <button onClick={fetchAds} className="retry-button">
                🔄 Tentar novamente
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {anuncios.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum anúncio cadastrado ainda.</p>
                </div>
              ) : (
                <>
                  <AdsCarousel ads={anunciosDestaque} />
                  <p className="ads-count">{anuncios.length} anúncios encontrados</p>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;