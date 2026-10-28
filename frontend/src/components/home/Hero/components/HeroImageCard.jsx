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
            {/* 1. Efeito de fundo desfocado com as cores da própria foto */}
            <div 
                className="hero-image-blur-bg"
                style={{ backgroundImage: `url(${imagem})` }}
            />

            {/* 2. Foto original 100% inteira no centro (sem cortes!) */}
            <img
                src={imagem}
                alt={ad.titulo}
                className="hero-image-main"
            />
        </div>
    );
}

export default HeroImageCard;