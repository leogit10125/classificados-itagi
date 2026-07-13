import { useNavigate } from "react-router-dom";
import "./HeroInfo.css";

function HeroInfo({ ad }) {
  const navigate = useNavigate();

  if (!ad) return null;

  const preco = Number(ad.preco || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });

  return (
    <div className="hero-info">

      <span className="hero-badge">
        ⭐ Em destaque
      </span>

      <span className="hero-category">
        {ad.categoria || "Geral"}
      </span>

      <h1 className="hero-title">
        {ad.titulo}
      </h1>

      <p className="hero-description">
        {ad.descricao}
      </p>

      <div className="hero-price">
        R$ {preco}
      </div>

      <div className="hero-location">
        📍 {ad.localizacao || "Itagi - BA"}
      </div>

      <button
        className="hero-button"
        onClick={() => navigate(`/anuncio/${ad.id}`)}
      >
        Ver anúncio
      </button>

    </div>
  );
}

export default HeroInfo;