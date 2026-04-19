import React, { useEffect, useState } from 'react';
import './MeusAnuncios.css';

function MeusAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const carregarMeusAnuncios = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Usuário logado:', usuario);
        console.log('🔑 Token existe?', !!token);
        
        // Verifica se tem token
        if (!token) {
          console.log('❌ Token não encontrado');
          setError('Faça login para ver seus anúncios');
          setAnuncios([]);
          setLoading(false);
          return;
        }
        
        // Usando a rota CORRETA: /api/ads/meus-anuncios
        console.log('📡 Chamando API: /api/ads/meus-anuncios');
        const response = await fetch('http://localhost:3000/api/ads/meus-anuncios', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos do backend:', data);
        
        // A resposta vem no formato: { success: true, anuncios: [...], total: X }
        if (data.success && Array.isArray(data.anuncios)) {
          setAnuncios(data.anuncios);
        } else if (Array.isArray(data)) {
          setAnuncios(data);
        } else {
          console.warn('Formato de resposta inesperado:', data);
          setAnuncios([]);
        }
        
      } catch (err) {
        console.error("❌ Erro detalhado:", err);
        setError(err.message);
        setAnuncios([]);
      } finally {
        setLoading(false);
      }
    };

    carregarMeusAnuncios();
  }, [token]); // Só depende do token

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir? Esta ação não pode ser desfeita!")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/ads/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove da lista local
        setAnuncios(anuncios.filter(ad => ad.id !== id));
        alert("Anúncio excluído com sucesso!");
      } else {
        const error = await response.json();
        alert(`Erro ao excluir: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error("Erro na exclusão:", err);
      alert("Erro de conexão com o servidor.");
    }
  };

  if (loading) {
    return (
      <div className="meus-anuncios-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>🔄 Carregando seus anúncios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-anuncios-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>❌ Erro: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meus-anuncios-container">
      <h2>📱 Meus Anúncios</h2>
      <p>Total: {anuncios.length} anúncio(s)</p>
      
      <div className="lista-meus-anuncios">
        {anuncios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>📭 Você ainda não publicou nenhum anúncio.</p>
            <button 
              onClick={() => window.location.href = '/criar-anuncio'}
              style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}
            >
              ✨ Criar meu primeiro anúncio
            </button>
          </div>
        ) : (
          anuncios.map(ad => (
            <div key={ad.id} className="item-anuncio">
              <div className="imagem-area">
                {ad.imagens && ad.imagens.length > 0 ? (
                  <img 
                    src={`http://localhost:3000/uploads/${ad.imagens[0]}`}
                    alt={ad.titulo}
                    style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x80?text=Erro+Imagem';
                    }}
                  />
                ) : (
                  <img 
                    src="https://via.placeholder.com/100x80?text=Sem+Imagem" 
                    alt="Sem imagem"
                    style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                  />
                )}
              </div>
              
              <div className="info">
                <h4>{ad.titulo}</h4>
                <p className="descricao">{ad.descricao?.substring(0, 100)}...</p>
                <p className="preco">💰 R$ {parseFloat(ad.preco).toFixed(2)}</p>
                <p className="categoria">📂 {ad.categoria || 'Sem categoria'}</p>
                <p className="data">📅 {new Date(ad.created_at).toLocaleDateString('pt-BR')}</p>
              </div>

              <button 
                onClick={() => handleDelete(ad.id)} 
                className="btn-delete"
                title="Excluir Anúncio"
              >
                🗑️ Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeusAnuncios;