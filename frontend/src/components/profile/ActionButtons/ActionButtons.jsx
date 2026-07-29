import "./ActionButtons.css";

function ActionButtons({
    anuncio,
    onEdit,
    onDelete,
    onToggleDestaque
}) {

    return (

        <div className="action-buttons">

            <button
                className="btn editar"
                onClick={() => onEdit(anuncio.id)}
            >
                ✏ Editar
            </button>

            <button
                className="btn destaque"
                onClick={() => onToggleDestaque(anuncio)}
            >
                {anuncio.destaque ? "⭐ Remover Destaque" : "🚀 Destacar"}
            </button>

            <button
                className="btn excluir"
                onClick={() => onDelete(anuncio.id)}
            >
                🗑 Excluir
            </button>

        </div>

    );

}

export default ActionButtons;
