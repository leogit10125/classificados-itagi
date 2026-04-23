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
        
        if (!token) {
          setError('Você precisa estar logado');
          return;
        }
        
        const response = await fetch('http://localhost:3000/api/ads/meus-anuncios', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.anuncios)) {
          setAnuncios(data.anuncios);
        } else {
          setAnuncios([]);
        }
        
      } catch (err) {
        console.error("❌ Erro:", err);
        setError(err.message);
        setAnuncios([]);
      } finally {
        setLoading(false);
      }
    };

    carregarMeusAnuncios();
  }, [token]);

  // Função para EDITAR anúncio
  const handleEdit = (id) => {
    window.location.href = `/editar-anuncio/${id}`;
  };

  // Função para EXCLUIR anúncio
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
        setAnuncios(anuncios.filter(ad => ad.id !== id));
        alert("✅ Anúncio excluído com sucesso!");
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error("Erro na exclusão:", err);
      alert("Erro de conexão com o servidor.");
    }
  };

  if (loading) {
    return (
      <div className="meus-anuncios-container">
        <p>🔄 Carregando seus anúncios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-anuncios-container">
        <p style={{ color: 'red' }}>❌ Erro: {error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="meus-anuncios-container">
      <h2>📱 Meus Anúncios</h2>
      <p>Total: {anuncios.length} anúncio(s)</p>
      
      <div className="lista-meus-anuncios">
        {anuncios.length === 0 ? (
          <div className="sem-anuncios">
            <p>📭 Você ainda não publicou nenhum anúncio.</p>
            <button onClick={() => window.location.href = '/criar-anuncio'}>
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
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x80?text=Sem+Imagem';
                    }}
                  />
                ) : (
                  <img src="https://via.placeholder.com/100x80?text=Sem+Imagem" alt="Sem imagem" />
                )}
              </div>
              
              <div className="info">
                <h4>{ad.titulo}</h4>
                <p className="descricao">{ad.descricao?.substring(0, 100)}...</p>
                <p className="preco">💰 R$ {parseFloat(ad.preco).toFixed(2)}</p>
                <p className="categoria">📂 {ad.categoria || 'Sem categoria'}</p>
                <p className="data">📅 {new Date(ad.created_at).toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="botoes-acao">
                <button 
                  onClick={() => handleEdit(ad.id)} 
                  className="btn-edit"
                  title="Editar Anúncio"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleDelete(ad.id)} 
                  className="btn-delete"
                  title="Excluir Anúncio"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeusAnuncios;