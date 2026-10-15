import { Link } from "react-router-dom";
import "./AdInfo.css";

function AdInfo({ anuncio }) {

    const preco = Number(anuncio.preco || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (

        <div className="ad-info">

            <div className="ad-price">

                R$ {preco}

            </div>

            <Link
                to={`/anuncio/${anuncio.id}`}
                className="ad-title"
            >

                {anuncio.titulo}

            </Link>

            <span className="ad-category">

                {anuncio.categoria || "Geral"}

            </span>

            <div className="ad-location">

                📍 {anuncio.localizacao || "Itagi"}

            </div>

            <div className="ad-stats">

                👁 {anuncio.visualizacoes || 0} visualizações

            </div>

        </div>

    );

}

export default AdInfo;