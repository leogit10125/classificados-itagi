import React from "react";
import "./AdCard.css";
import { useNavigate } from "react-router-dom";

function AdCard({ ad }) {
  if (!ad) return null;

  const navigate = useNavigate();

  const formatarPreco = (preco) => {
    if (!preco) return "0,00";
    const numero = Number(preco);
    return isNaN(numero)
      ? "0,00"
      : numero.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        });
  };

  const getImagemUrl = () => {
    const img = ad.imagens?.[0];
    if (!img) return null;

    return `http://localhost:3000/uploads/${img}`;
  };

  const imageUrl = getImagemUrl();

  return (
    <div className="ad-card" onClick={() => ad.id && navigate(`/anuncio/${ad.id}`)}>

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

        <button
          className="ad-card-favorite"
          onClick={(e) => e.stopPropagation()}
        >
          🤍
        </button>
      </div>

      <div className="ad-card-content">
        <div className="ad-card-top">
          <div className="ad-card-price">
            <span className="currency-symbol">R$</span>{" "}
            {formatarPreco(ad.preco)}
          </div>

          <h2 className="ad-card-title" title={ad.titulo}>
            {ad.titulo || "Sem título"}
          </h2>
        </div>

        <div className="ad-card-footer">
          <span className="ad-card-location">
            📍 {ad.localizacao || "Itagi - BA"}
          </span>

          <span className="ad-card-category">
            {ad.categoria_slug || ad.categoria || "Geral"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdCard;