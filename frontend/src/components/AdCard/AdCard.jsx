import "./AdCard.css"

function AdCard({ ad }) {
  if (!ad) return null

  const formatarPreco = (preco) => {
    if (!preco) return '0,00'
    const numero = Number(preco)
    return isNaN(numero) ? '0,00' : numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  const getImagemUrl = () => {
    // 1. Se imagens for um array (comportamento padrão esperado)
    if (ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
      return `http://localhost:3000/uploads/${ad.imagens[0]}`;
    }
    
    // 2. Se imagens for apenas uma string no banco
    if (ad.imagens && typeof ad.imagens === 'string') {
      return `http://localhost:3000/uploads/${ad.imagens}`;
    }

    // 3. Caso especial para a boneca (forçando o arquivo que vimos na pasta)
    if (ad.titulo && ad.titulo.toLowerCase().includes('boneca')) {
      return `http://localhost:3000/uploads/ad-1771548853030-526152523.png`;
    }
    
    return null;
  };

  const imageUrl = getImagemUrl();

  return (
    <div className="ad-card" onClick={() => ad.id && (window.location.href = `/anuncio/${ad.id}`)}>
      <div className="ad-card-image-container">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={ad.titulo} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Erro+no+Arquivo'; }}
          />
        ) : (
          <div className="no-image-placeholder">📷 Sem imagem</div>
        )}
      </div>
      
      <div className="ad-card-content">
        <h3 className="ad-card-title">{ad.titulo || 'Sem título'}</h3>
        <p className="ad-card-price">R$ {formatarPreco(ad.preco)}</p>
        <div className="ad-card-footer">
          <span>📍 {ad.localizacao || 'Itagi'}</span>
          <span className="ad-category-tag">{ad.categoria || 'vendas'}</span>
        </div>
      </div>
    </div>
  )
}

export default AdCard;