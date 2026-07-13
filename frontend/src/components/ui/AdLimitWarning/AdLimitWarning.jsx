import React, { useEffect, useState } from 'react';
import './AdLimitWarning.css';

function AdLimitWarning() {
  const [creditos, setCreditos] = useState(null);
  const [showPacotes, setShowPacotes] = useState(false);
  const [pacotes, setPacotes] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    carregarCreditos();
    carregarPacotes();
  }, []);

  const carregarCreditos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pacotes/creditos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCreditos(data);
    } catch (err) {
      console.error('Erro ao carregar créditos:', err);
    }
  };

  const carregarPacotes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pacotes');
      const data = await response.json();
      setPacotes(data);
    } catch (err) {
      console.error('Erro ao carregar pacotes:', err);
    }
  };

  const comprarPacote = async (pacote) => {
    try {
      const response = await fetch('http://localhost:3000/api/pacotes/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pacoteId: pacote.id,
          quantidade: pacote.quantidade,
          valor: pacote.preco
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setShowPacotes(false);
        carregarCreditos();
      } else {
        alert('Erro ao processar compra');
      }
    } catch (err) {
      console.error('Erro na compra:', err);
      alert('Erro de conexão');
    }
  };

  if (!creditos) return null;

  return (
    <div className="ad-limit-warning">
      <div className="credit-status">
        <div className="credit-card">
          <span className="credit-icon">🎁</span>
          <div>
            <strong>Anúncios Gratuitos</strong>
            <p>Usados: {creditos.anunciosGratuitosUsados}/2</p>
            <p>Restantes: {creditos.anunciosGratuitosRestantes}</p>
          </div>
        </div>
        
        <div className="credit-card">
          <span className="credit-icon">💰</span>
          <div>
            <strong>Créditos Pagos</strong>
            <p>Disponíveis: {creditos.creditosPagosDisponiveis}</p>
          </div>
        </div>

        {creditos.anunciosGratuitosRestantes === 0 && creditos.creditosPagosDisponiveis === 0 && (
          <button 
            className="buy-package-btn"
            onClick={() => setShowPacotes(true)}
          >
            🚀 Adquirir Pacote de Anúncios
          </button>
        )}
      </div>

      {showPacotes && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Escolha seu Pacote</h2>
            <div className="packages-grid">
              {pacotes.map(pacote => (
                <div key={pacote.id} className="package-card">
                  <h3>{pacote.nome}</h3>
                  <p className="quantity">{pacote.quantidade} anúncios</p>
                  <p className="price">R$ {pacote.preco.toFixed(2)}</p>
                  {pacote.destaque && <span className="badge">⭐ Destaque</span>}
                  <button onClick={() => comprarPacote(pacote)}>
                    Comprar
                  </button>
                </div>
              ))}
            </div>
            <button className="close-modal" onClick={() => setShowPacotes(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdLimitWarning;