import React from "react";
import "./AdCard.css";

function AdCard({ ad }) {
  if (!ad) return null;

  // Formatação de preço limpa
  const formatarPreco = (preco) => {
    if (!preco) return "0,00";
    const numero = Number(preco);
    return isNaN(numero)
      ? "0,00"
      : numero.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        });
  };

  // Mantendo sua lógica exata de busca de imagens do backend
  const getImagemUrl = () => {
    if (ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
      return `http://localhost:3000/uploads/${ad.imagens[0]}`;
    }
    if (ad.imagens && typeof ad.imagens === "string") {
      return `http://localhost:3000/uploads/${ad.imagens}`;
    }
    return null;
  };

  const imageUrl = getImagemUrl();

  return (
    <div
      className="ad-card"
      onClick={() => ad.id && (window.location.href = `/anuncio/${ad.id}`)}
    >
      {/* Container de Imagem Profissional com proporção fixa */}
      <div className="ad-card-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={ad.titulo}
            className="ad-card-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=Sem+Imagem";
            }}
          />
        ) : (
          <div className="ad-card-no-image">
            <span>📷 Sem foto</span>
          </div>
        )}
        
        {/* Botão de favorito estilizado por cima da imagem */}
        <button 
          className="ad-card-favorite"
          onClick={(e) => {
            e.stopPropagation(); // Evita clicar no card ao favoritar
            // Lógica futura de favoritos aqui
          }}
        >
          🤍
        </button>
      </div>

      {/* Corpo do Anúncio Organizado */}
      <div className="ad-card-content">
        <div className="ad-card-top">
          <div className="ad-card-price">
            <span className="currency-symbol">R$</span> {formatarPreco(ad.preco)}
          </div>
          <h2 className="ad-card-title" title={ad.titulo}>
            {ad.titulo || "Sem título"}
          </h2>
        </div>

        {/* Rodapé com localização e categoria */}
        <div className="ad-card-footer">
          <span className="ad-card-location">
            📍 {ad.localizacao || "Itagi - BA"}
          </span>
          <span className="ad-card-category">
            {ad.categoria || "Geral"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdCard;