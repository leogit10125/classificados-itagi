import { Link } from "react-router-dom";

import {
    AdImage,
    AdPrice,
    AdLocation,
    AdStats,
    PremiumBadge,
    FavoriteButton,
    AdActions
} from "./components";

import "./AdCardV2.css";

function AdCardV2({ anuncio }) {

    if (!anuncio) return null;

    return (

        <article className="ad-card-v2">

            <div className="ad-image-area">

                <AdImage anuncio={anuncio} />

                <PremiumBadge anuncio={anuncio} />

                <FavoriteButton />

            </div>

            <div className="ad-content">

                <AdPrice preco={anuncio.preco} />

                <Link
                    to={`/anuncio/${anuncio.id}`}
                    className="ad-title"
                >

                    {anuncio.titulo}

                </Link>

                <AdLocation
                    localizacao={anuncio.localizacao}
                />

                <AdStats anuncio={anuncio} />

                <AdActions anuncio={anuncio} />

            </div>

        </article>

    );

}

export default AdCardV2;