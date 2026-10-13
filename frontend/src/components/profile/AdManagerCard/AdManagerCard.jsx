import "./AdManagerCard.css";

import StatusBadge from "../StatusBadge";
import ActionButtons from "../ActionButtons";
import { UPLOADS_URL } from "../../../config/api";



function AdManagerCard({
    anuncio,
    onEdit,
    onDelete,
    onToggleDestaque
}) {

    const imagem = anuncio.imagens?.length
        ? `${UPLOADS_URL}/${anuncio.imagens[0]}`
        : "https://via.placeholder.com/220x160?text=Sem+Imagem";

    return (

        <div className="ad-card">

            <div className="ad-image">

                <img
                    src={imagem}
                    alt={anuncio.titulo}
                />

            </div>

            <div className="ad-content">

                <h3>{anuncio.titulo}</h3>

                <p className="preco">

                    R$ {Number(anuncio.preco).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                    })}

                </p>

                <p className="categoria">

                    {anuncio.categoria}

                </p>

                <StatusBadge
                    status={anuncio.status}
                    destaque={anuncio.destaque}
                />

                <ActionButtons
                    anuncio={anuncio}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleDestaque={onToggleDestaque}
                />

            </div>

        </div>

    );

}

export default AdManagerCard;
