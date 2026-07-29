import "./DangerZone.css";

function DangerZone({

    onDelete

}){

    return(

        <section className="danger-zone">

            <h2>⚠ Zona de perigo</h2>

            <p>

                Excluir um anúncio remove todas as informações e imagens.

            </p>

            <button
                onClick={onDelete}
            >

                🗑 Excluir anúncio

            </button>

        </section>

    );

}

export default DangerZone;