import React, { useEffect, useState } from 'react';
import { api } from '../../services/api'; 
import './MeusAnuncios.css';

function MeusAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pegamos o token e o usuário do localStorage
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const carregarMeusAnuncios = async () => {
      try {
        setLoading(true);
        // Busca anúncios filtrados pelo ID do usuário logado
        const data = await api.getAdsByUser(usuario.id); 
        setAnuncios(data);
      } catch (err) {
        console.error("Erro ao carregar seus anúncios:", err);
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.id) {
      carregarMeusAnuncios();
    }
  }, [usuario?.id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir? A imagem será removida do servidor para sempre.")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/ads/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        // Remove da tela instantaneamente
        setAnuncios(anuncios.filter(ad => ad.id !== id));
        alert("Anúncio e imagem excluídos com sucesso!");
      } else {
        alert("Erro ao excluir o anúncio.");
      }
    } catch (err) {
      console.error("Erro na exclusão:", err);
      alert("Erro de conexão com o servidor.");
    }
  };

  if (loading) return <div className="meus-anuncios-container"><p>Carregando...</p></div>;

  return (
    <div className="meus-anuncios-container">
      <h2>Gerenciar Meus Anúncios</h2>
      
      <div className="lista-meus-anuncios">
        {anuncios.length === 0 ? (
          <p>Você ainda não publicou nenhum anúncio.</p>
        ) : (
          anuncios.map(ad => (
            <div key={ad.id} className="item-anuncio">
              <img 
                src={ad.imagens && ad.imagens.length > 0 
                  ? `http://localhost:3000/uploads/${ad.imagens[0]}` 
                  : 'https://via.placeholder.com/100x80?text=Sem+Foto'} 
                alt={ad.titulo} 
              />
              
              <div className="info">
                <h4>{ad.titulo}</h4>
                <p className="preco">R$ {parseFloat(ad.preco).toFixed(2)}</p>
                <p className="data">Postado em: {new Date(ad.created_at).toLocaleDateString('pt-BR')}</p>
              </div>

              <button 
                onClick={() => handleDelete(ad.id)} 
                className="btn-delete"
                title="Excluir Anúncio"
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeusAnuncios;