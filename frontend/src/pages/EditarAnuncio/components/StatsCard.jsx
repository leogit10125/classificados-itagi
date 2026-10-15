import "./StatsCard.css";

function StatsCard({ anuncio }) {

    if (!anuncio) return null;

    return (

        <div className="stats-grid">

            <div className="stat-card">

                <span>👁</span>

                <strong>{anuncio.views ?? 0}</strong>

                <small>Visualizações</small>

            </div>

            <div className="stat-card">

                <span>⭐</span>

                <strong>

                    {anuncio.destaque ? "Destaque" : "Normal"}

                </strong>

                <small>Status</small>

            </div>

            <div className="stat-card">

                <span>📅</span>

                <strong>

                    {anuncio.criado_em
                        ? new Date(anuncio.criado_em).toLocaleDateString("pt-BR")
                        : "--/--/----"}

                </strong>

                <small>Publicado</small>

            </div>

        </div>

    );

}

export default StatsCard;