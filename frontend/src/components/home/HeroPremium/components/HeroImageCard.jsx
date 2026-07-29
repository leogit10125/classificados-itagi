import "./HeroImageCard.css";

const UPLOADS_URL = "http://localhost:3000/uploads";

function HeroImageCard({ ad }) {

    if (!ad) return null;

    const imagem =
        Array.isArray(ad.imagens) && ad.imagens.length
            ? `${UPLOADS_URL}/${ad.imagens[0]}`
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