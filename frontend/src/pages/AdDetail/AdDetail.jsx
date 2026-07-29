// frontend/src/pages/AdDetail/AdDetail.jsx

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

    useEffect(() => {

        let ativo = true;

        async function carregar() {

            try {

                setLoading(true);

                const data = await AdsAPI.detalhes(id);

                if (!ativo) return;

                setAnuncio(data);
                setError(null);

            } catch (err) {

                console.error(err);

                if (ativo) {

                    setError(err.message);

                }

            } finally {

                if (ativo) {

                    setLoading(false);

                }

            }

        }

        if (id) {

            carregar();

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

            return foto.startsWith("http")

                ? foto

                : `${UPLOADS_URL}/${foto}`;

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

        return new Date(data).toLocaleDateString("pt-BR");

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

                    <button onClick={() => history.back()}>

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

    return (

        <div className="ad-detail-container">

            <div className="ad-detail-card">

                <h1 className="ad-detail-title">

                    {anuncio.titulo}

                </h1>

                <div className="ad-detail-content">

                    <div className="ad-detail-image">

                        {getImagemUrl() ? (

                            <img

                                src={getImagemUrl()}

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

                            <button

                                className="btn-back"

                                onClick={() => history.back()}

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