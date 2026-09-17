import { useNavigate } from "react-router-dom";
import "./HeroContent.css";

function HeroContent({ ad }) {

    const navigate = useNavigate();

    if (!ad) return null;

    return (

        <div className="hero-content">


            <button
                className="hero-button"
                onClick={() => navigate(`/anuncio/${ad.id}`)}
            >
                Ver Anuncio →
            </button>

        </div>

    );

}

export default HeroContent;