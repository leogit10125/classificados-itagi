import React from "react";
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
            {/* Apenas a foto real flutuando */}
            <img
                src={imagem}
                alt={ad.titulo}
                className="hero-image-main"
            />
        </div>
    );
}

export default HeroImageCard;