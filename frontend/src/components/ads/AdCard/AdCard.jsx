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

    );

}


export default AdCard;