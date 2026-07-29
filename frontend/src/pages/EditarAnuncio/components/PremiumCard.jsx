import { useState } from "react";

import { AdsAPI } from "../../../api";

import "./PremiumCard.css";

function PremiumCard({ anuncio, setAnuncio }) {

    const [loading, setLoading] = useState(false);

    if (!anuncio) return null;

    async function handleUpgrade() {

        try {

            setLoading(true);

            await AdsAPI.destacar(anuncio.id);

            setAnuncio({
                ...anuncio,
                destaque: true
            });

        } catch (err) {

            console.error(err);

            alert(
                err.message ||
                "Não foi possível destacar o anúncio."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <section className="premium-card">

            <div className="premium-header">

                <span className="premium-icon">⭐</span>

                <div>

                    <h2>Anúncio Premium</h2>

                    <p>
                        Destaque seu anúncio e alcance mais compradores.
                    </p>

                </div>

            </div>

            <div className="premium-status">

                <span>Status</span>

                <strong
                    className={
                        anuncio.destaque
                            ? "active"
                            : "inactive"
                    }
                >

                    {
                        anuncio.destaque
                            ? "EM DESTAQUE"
                            : "ANÚNCIO GRATUITO"
                    }

                </strong>

            </div>

            <ul className="premium-benefits">

                <li>🚀 Aparece no Hero da página inicial</li>

                <li>📈 Mais visualizações</li>

                <li>🥇 Prioridade nas buscas</li>

                <li>⭐ Badge Premium</li>

            </ul>

            {

                !anuncio.destaque && (

                    <button
                        className="premium-button"
                        onClick={handleUpgrade}
                        disabled={loading}
                    >

                        {

                            loading
                                ? "Ativando..."
                                : "⭐ Tornar Premium"

                        }

                    </button>

                )

            }

        </section>

    );

}

export default PremiumCard;