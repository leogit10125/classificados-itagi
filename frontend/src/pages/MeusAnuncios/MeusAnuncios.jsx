// frontend/src/pages/MeusAnuncios/MeusAnuncios.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdsAPI } from "../../api";
import { UPLOADS_URL } from "../../config/api";

import "./MeusAnuncios.css";

function MeusAnuncios() {

    const navigate = useNavigate();

    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        carregarMeusAnuncios();

    }, []);

    async function carregarMeusAnuncios() {

        try {

            setLoading(true);
            setError(null);

            const data = await AdsAPI.meus();

            if (Array.isArray(data)) {

                setAnuncios(data);

            } else if (Array.isArray(data.anuncios)) {

                setAnuncios(data.anuncios);

            } else {

                setAnuncios([]);

            }

        } catch (err) {

            console.error(err);

            setError(err.message);

            setAnuncios([]);

        } finally {

            setLoading(false);

        }

    }

    function handleEdit(id) {

        navigate(`/editar-anuncio/${id}`);

    }

    async function handleDelete(id) {

        if (!window.confirm("Tem certeza que deseja excluir este anúncio?")) {

            return;

        }

        try {

            await AdsAPI.excluir(id);

            setAnuncios((lista) =>

                lista.filter((ad) => ad.id !== id)

            );

            alert("Anúncio excluído com sucesso.");

        } catch (err) {

            console.error(err);

            alert(err.message);

        }

    }

    if (loading) {

        return (

            <div className="meus-anuncios-container">

                <p>Carregando seus anúncios...</p>

            </div>

        );

    }

    if (error) {

        return (

            <div className="meus-anuncios-container">

                <p style={{ color: "red" }}>

                    {error}

                </p>

                <button onClick={carregarMeusAnuncios}>

                    Tentar novamente

                </button>

            </div>

        );

    }

    return (

        <div className="meus-anuncios-container">

            <h2>Meus anúncios</h2>

            <p>

                Total: {anuncios.length}

            </p>

            <div className="lista-meus-anuncios">

                {

                    anuncios.length === 0

                        ?

                        <div className="sem-anuncios">

                            <p>

                                Você ainda não publicou anúncios.

                            </p>

                            <button

                                onClick={() => navigate("/anunciar")}

                            >

                                Criar anúncio

                            </button>

                        </div>

                        :

                        anuncios.map((ad) => (

                            <div

                                key={ad.id}

                                className="item-anuncio"

                            >

                                <div className="imagem-area">

                                    {

                                        Array.isArray(ad.imagens) &&

                                        ad.imagens.length > 0

                                            ?

                                            <img

                                                src={`${UPLOADS_URL}/${ad.imagens[0]}`}

                                                alt={ad.titulo}

                                            />

                                            :

                                            <img

                                                src="/images/placeholder.jpg"

                                                alt="Sem imagem"

                                            />

                                    }

                                </div>

                                <div className="info">

                                    <h4>

                                        {ad.titulo}

                                    </h4>

                                    <p className="descricao">

                                        {ad.descricao}

                                    </p>

                                    <p className="preco">

                                        R$

                                        {" "}

                                        {Number(ad.preco).toLocaleString(

                                            "pt-BR",

                                            {

                                                minimumFractionDigits: 2

                                            }

                                        )}

                                    </p>

                                    <p>

                                        {ad.categoria}

                                    </p>

                                </div>

                                <div className="botoes-acao">

                                    <button

                                        className="btn-edit"

                                        onClick={() => handleEdit(ad.id)}

                                    >

                                        Editar

                                    </button>

                                    <button

                                        className="btn-delete"

                                        onClick={() => handleDelete(ad.id)}

                                    >

                                        Excluir

                                    </button>

                                </div>

                            </div>

                        ))

                }

            </div>

        </div>

    );

}

export default MeusAnuncios;