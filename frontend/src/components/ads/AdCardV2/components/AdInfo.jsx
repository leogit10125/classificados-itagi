import AdPrice from "./AdPrice";
import AdLocation from "./AdLocation";
import AdStats from "./AdStats";
import AdActions from "./AdActions";

import "./AdInfo.css";

function AdInfo({ anuncio }){

    return(

        <div className="ad-info">

            <AdPrice anuncio={anuncio}/>

            <h3>

                {anuncio.titulo}

            </h3>

            <span className="categoria">

                {anuncio.categoria}

            </span>

            <AdLocation anuncio={anuncio}/>

            <AdStats anuncio={anuncio}/>

            <AdActions anuncio={anuncio}/>

        </div>

    );

}

export default AdInfo;