
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { AdsAPI } from "../../api";
import { UPLOADS_URL } from "../../config/api";

import "./AdDetail.css";

function AdDetail() {
    const { id } = useParams();

    const [anuncio, setAnuncio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Remove caracteres que não sejam números.
    const telefoneWhatsApp = (anuncio?.telefone || "").replace(/\D/g, "");

    // Prepara o telefone no formato internacional para o link wa.me.
    const numeroWhatsApp = telefoneWhatsApp
        ? (
            telefoneWhatsApp.startsWith("55")
                ? telefoneWhatsApp
                : `55${telefoneWhatsApp}`
        )
        : "";

    // O botão só aparece se houver autorização e telefone válido.
    const podeConversarWhatsApp =
        Number(anuncio?.whatsapp_publico) === 1 &&
        numeroWhatsApp.length >= 12 &&
        numeroWhatsApp.length <= 13;

    // Mensagem preenchida automaticamente ao abrir o WhatsApp.
    const linkWhatsApp = podeConversarWhatsApp
        ? `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
            `Olá! Tenho interesse no anúncio: ${anuncio?.titulo || ""}`
        )}`
        : "";

    // Formata o telefone para exibição no anúncio.
    const formatarTelefoneVisual = (telefone) => {
        const digitos = (telefone || "").replace(/\D/g, "");

        // Remove o código do Brasil se já estiver presente.
        const nacional =
            digitos.startsWith("55") &&
            (digitos.length === 12 || digitos.length === 13)
                ? digitos.slice(2)
                : digitos;

        if (nacional.length === 11) {
            return `(${nacional.slice(0, 2)}) ${nacional.slice(2, 7)}-${nacional.slice(7)}`;
        }

        if (nacional.length === 10) {
            return `(${nacional.slice(0, 2)}) ${nacional.slice(2, 6)}-${nacional.slice(6)}`;
        }

        return telefone || "";
    };

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                setLoading(true);

                const data = await AdsAPI.buscar(id);

                if (!ativo) return;

                setAnuncio(data);
                setError(null);
                setImageError(false);
            } catch (err) {
                console.error("Erro ao carregar anúncio:", err);

                if (ativo) {
                    setError(err.message || "Não foi possível carregar o anúncio.");
                }
            } finally {
                if (ativo) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            carregar();
        } else {
            setLoading(false);
            setError("Identificador do anúncio não informado.");
        }

        return () => {
            ativo = false;
        };
    }, [id]);

    const getImagemUrl = () => {
        if (imageError) return null;

        if (
            Array.isArray(anuncio?.imagens) &&
            anuncio.imagens.length > 0
        ) {
            const foto = anuncio.imagens[0];

            if (typeof foto !== "string") return null;

            return foto.startsWith("http")
                ? foto
                : `${UPLOADS_URL}/${foto.replace(/^\/+/, "")}`;
        }

        return null;
    };

    const formatarPreco = (preco) =>
        Number(preco || 0).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const formatarData = (data) => {
        if (!data) return "Data não informada";

        const dataObj = new Date(data);

        if (Number.isNaN(dataObj.getTime())) {
            return "Data não informada";
        }

        return dataObj.toLocaleDateString("pt-BR");
    };

    if (loading) {
        return (
            <div className="ad-detail-container">
                <div className="loading-spinner">
                    <p>🔄 Carregando anúncio...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ad-detail-container">
                <div className="error-message">
                    <p>❌ {error}</p>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    if (!anuncio) {
        return (
            <div className="ad-detail-container">
                <p>Anúncio não encontrado.</p>
            </div>
        );
    }

    const imagemUrl = getImagemUrl();

    return (
        <div className="ad-detail-container">
            <div className="ad-detail-card">
                <h1 className="ad-detail-title">
                    {anuncio.titulo}
                </h1>

                <div className="ad-detail-content">
                    <div className="ad-detail-image">
                        {imagemUrl ? (
                            <img
                                src={imagemUrl}
                                alt={anuncio.titulo}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="no-image">
                                <span>📸</span>
                                <p>Sem imagem</p>
                            </div>
                        )}
                    </div>

                    <div className="ad-detail-info">
                        <p className="ad-price">
                            💰 R$ {formatarPreco(anuncio.preco)}
                        </p>

                        <p className="ad-category">
                            📂 {anuncio.categoria || "Não informada"}
                        </p>

                        <p className="ad-location">
                            📍 {anuncio.localizacao || "Não informada"}
                        </p>

                        <p className="ad-date">
                            📅 {formatarData(anuncio.criado_em)}
                        </p>

                        <p className="ad-views">
                            👁️ {anuncio.views || 0}
                        </p>

                        <div className="ad-description">
                            <h3>Descrição</h3>

                            <p>
                                {anuncio.descricao || "Sem descrição"}
                            </p>
                        </div>

                        <div className="ad-actions">
                            {podeConversarWhatsApp && (
                                <a
                                    className="btn-whatsapp"
                                    href={linkWhatsApp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Conversar pelo WhatsApp: ${formatarTelefoneVisual(anuncio.telefone)}`}
                                >
                                    <svg
                                        className="whatsapp-icon"
                                        viewBox="0 0 448 512"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7C49.5 323.3 39 288.8 39 253.9c0-101.7 82.8-184.5 184.7-184.5 49.3 0 95.7 19.2 130.5 54.1 34.8 34.9 56.2 81.3 56.1 130.6 0 101.8-84.6 184.6-186.4 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 19.6 10.1 1.5 19.3 1 26.6-.8 8.4-1.2 32.8-13.4 37.4-26.4 4.6-13 5.7-24.1 3.3-26.4-1.4-2.4-5.1-3.8-10.6-6.6z"
                                        />
                                    </svg>

                                    <span>WhatsApp</span>

                                    <span className="whatsapp-phone">
                                        {formatarTelefoneVisual(anuncio.telefone)}
                                    </span>
                                </a>
                            )}

                            <button
                                type="button"
                                className="btn-back"
                                onClick={() => window.history.back()}
                            >
                                ← Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdDetail;
