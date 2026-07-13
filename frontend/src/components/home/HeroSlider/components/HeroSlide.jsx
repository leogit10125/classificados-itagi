import HeroImage from "./HeroImage";
import HeroInfo from "./HeroInfo";
import "./HeroSlide.css";

const UPLOADS_URL = "http://localhost:3000/uploads";

function HeroSlide({ ad }) {

  if (!ad) return null;

  const imagem =
    Array.isArray(ad.imagens) && ad.imagens.length
      ? `${UPLOADS_URL}/${ad.imagens[0]}`
      : "/images/placeholder.jpg";

  return (
    <div className="hero-slide">

      <div className="hero-slide-image">
        <HeroImage
          imagem={imagem}
          titulo={ad.titulo}
        />
      </div>

      <div className="hero-slide-info">
        <HeroInfo ad={ad} />
      </div>

    </div>
  );
}

export default HeroSlide;