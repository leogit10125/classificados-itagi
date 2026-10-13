import { getImageUrl } from "../../../../utils/imageUrl";
import "./HeroImageCard.css";



function HeroImageCard({ ad }) {

    if (!ad) return null;

    const imagem =
        Array.isArray(ad.imagens) && ad.imagens.length
            ? getImageUrl(ad.imagens[0])
            : "/images/placeholder.jpg";

    return (

        <div className="hero-image-card">

            <img
                src={imagem}
                alt={ad.titulo}
            />

        </div>

    );

}

export default HeroImageCard;