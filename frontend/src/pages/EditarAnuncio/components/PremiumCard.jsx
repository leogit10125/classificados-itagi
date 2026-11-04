import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdsAPI } from "../../../api";
import "./PremiumCard.css";

function PremiumCard({ anuncio, setAnuncio }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!anuncio) return null;

    async function handleUpgrade() {
        try {
            setLoading(true);

            const resposta = await AdsAPI.destacar(anuncio.id);

            setAnuncio({
                ...anuncio,
                destaque: true
            });

            alert(resposta.message || "🌟 Parabéns! Seu anúncio agora está em destaque no topo!");

        } catch (err) {
            console.error(err);
            const mensagem = err.message || "Não foi possível destacar o anúncio.";

            // 💰 Se não tiver créditos, convida para adquirir agora
            const desejaComprar = window.confirm(
                `⚠️ ${mensagem}\n\nDeseja ir para a página de compra de créditos agora?`
            );

            if (desejaComprar) {
                navigate("/anunciar");
            }
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
                        Destaque seu anúncio e alcance mais compradores em Itagi e região.
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
                            ? "⭐ EM DESTAQUE"
                            : "ANÚNCIO GRATUITO"
                    }
                </strong>
            </div>

            <ul className="premium-benefits">
                <li>🚀 Aparece no Hero da página inicial</li>
                <li>📈 Mais visualizações e cliques</li>
                <li>🥇 Prioridade máxima nas buscas</li>
                <li>⭐ Badge Premium nos cards</li>
            </ul>

            {
                !anuncio.destaque && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            className="premium-button"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? "Ativando..." : "⭐ Tornar Premium"}
                        </button>
                        <small style={{ color: '#64748b', textAlign: 'center', fontSize: '0.78rem' }}>
                            💳 Custo: 1 crédito de anúncio
                        </small>
                    </div>
                )
            }
        </section>
    );
}

export default PremiumCard;