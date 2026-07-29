import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./AdActions.css";

function AdActions({ anuncio }) {

    return (

        <div className="ad-actions">

            <Link
                to={`/anuncio/${anuncio.id}`}
                className="view-button"
            >

                <span>Ver anúncio</span>

                <ArrowRight size={18} />

            </Link>

        </div>

    );

}

export default AdActions;