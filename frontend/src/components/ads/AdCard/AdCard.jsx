import { Link } from "react-router-dom";

import {
    AdImage,
    AdInfo,
    PremiumBadge,
    FavoriteButton,
    AdActions
} from "./components";

import "./AdCard.css";


function AdCard({ anuncio }) {

    if (!anuncio) return null;


    return (

        <Link
            to={`/anuncio/${anuncio.id}`}
            className="ad-card-link"
        >

            <article className="ad-card">

                <div className="ad-image-area">

                    <AdImage anuncio={anuncio} />

                    <PremiumBadge anuncio={anuncio} />

                    <FavoriteButton />

                </div>


                <div className="ad-content">

                    <AdInfo anuncio={anuncio} />

                    <AdActions anuncio={anuncio} />

                </div>

            </article>

        </Link>

    );

}


export default AdCard;