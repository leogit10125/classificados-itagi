import { UPLOADS_URL } from "../../../../config/api";
import "./AdImage.css";

function AdImage({ anuncio }) {

    function getImagem() {

        if (
            anuncio.imagens &&
            Array.isArray(anuncio.imagens) &&
            anuncio.imagens.length
        ) {

            return `${UPLOADS_URL}/${anuncio.imagens[0]}`;

        }

        return null;

    }

    const imagem = getImagem();

    return (

        <div className="ad-image">

            {imagem ? (

                <img

                    src={imagem}

                    alt={anuncio.titulo}

                    loading="lazy"

                    onError={(e)=>{

                        e.target.style.display="none";

                    }}

                />

            ) : (

                <div className="image-placeholder">

                    📷

                </div>

            )}

        </div>

    );

}

export default AdImage;