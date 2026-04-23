// frontend/src/pages/AdDetail/AdDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AdDetail.css';

function AdDetail() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true; // Prevenir memory leak
    
    const carregarAnuncio = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log('🔍 Carregando anúncio ID:', id);
        
        const response = await fetch(`http://localhost:3000/api/ads/${id}`);
        
        if (!response.ok) {
          throw new Error('Anúncio não encontrado');
        }
        
        const data = await response.json();
        
        if (isMounted) {
          console.log('✅ Anúncio carregado:', data);
          setAnuncio(data);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Erro:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    carregarAnuncio();
    
    // Cleanup para evitar atualizações em componente desmontado
    return () => {
      isMounted = false;
    };
  }, [id]); // Só recarrega se o ID mudar

  const getImagemUrl = () => {
    if (imageError) return null;
    if (anuncio?.imagens && anuncio.imagens.length > 0) {
      const foto = anuncio.imagens[0];
      return foto.startsWith('http') ? foto : `http://localhost:3000/uploads/${foto}`;
    }
    return null;
  };

  const formatarPreco = (preco) => {
    const valor = parseFloat(preco);
    return isNaN(valor) ? '0,00' : valor.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const formatarData = (data) => {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="ad-detail-container">
        <div className="loading-spinner">
          <p>🔄 Carregando anúncio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad-detail-container">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => window.history.back()}>Voltar</button>
        </div>
      </div>
    );
  }

  if (!anuncio) {
    return (
      <div className="ad-detail-container">
        <p>Anúncio não encontrado</p>
      </div>
    );
  }

  return (
    <div className="ad-detail-container">
      <div className="ad-detail-card">
        <h1 className="ad-detail-title">{anuncio.titulo}</h1>
        
        <div className="ad-detail-content">
          {/* Imagem */}
          <div className="ad-detail-image">
            {getImagemUrl() ? (
              <img 
                src={getImagemUrl()} 
                alt={anuncio.titulo}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="no-image">
                <span>📸</span>
                <p>Sem imagem</p>
              </div>
            )}
          </div>
          
          {/* Informações */}
          <div className="ad-detail-info">
            <p className="ad-price">💰 R$ {formatarPreco(anuncio.preco)}</p>
            <p className="ad-category">📂 Categoria: {anuncio.categoria || 'Não informada'}</p>
            <p className="ad-location">📍 Localização: {anuncio.localizacao || 'Não informada'}</p>
            <p className="ad-date">📅 Publicado em: {formatarData(anuncio.created_at)}</p>
            <p className="ad-views">👁️ Visualizações: {anuncio.views || 0}</p>
            
            <div className="ad-description">
              <h3>Descrição</h3>
              <p>{anuncio.descricao || 'Sem descrição'}</p>
            </div>
            
            <div className="ad-actions">
              <button 
                className="btn-back"
                onClick={() => window.history.back()}
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdDetail;