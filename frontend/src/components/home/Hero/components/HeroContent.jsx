import { useNavigate } from "react-router-dom";
import "./HeroContent.css";

function HeroContent({ ad }) {

    const navigate = useNavigate();

    if (!ad) return null;

    return (

        <div className="hero-content">

            <span className="hero-badge">
                ANÚNCIO EM DESTAQUE
            </span>

            <h1 className="hero-title">
                {ad.titulo}
            </h1>


            <button
                className="hero-button"
                onClick={() => navigate(`/anuncio/${ad.id}`)}
            >
                Ver anúncio →
            </button>

        </div>

    );

}

export default HeroContent;