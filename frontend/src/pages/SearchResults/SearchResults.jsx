// frontend/src/pages/SearchResults/SearchResults.jsx

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

import AdCard from "../../components/ads/AdCard/AdCard";

import { AdsAPI } from "../../api";
import { getImageUrl } from "../../utils/imageUrl";

import "./SearchResults.css";

function SearchResults() {

    const [searchParams] = useSearchParams();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const query = searchParams.get("q") || "";

    useEffect(() => {

        if (!query) {

            setResults([]);
            setLoading(false);

            return;

        }

        async function buscar() {

            try {

                setLoading(true);
                setError(null);

                const anuncios = await AdsAPI.listar();

                const termo = query.toLowerCase();

                const filtrados = anuncios.filter((ad) =>

                    ad.titulo?.toLowerCase().includes(termo) ||

                    ad.descricao?.toLowerCase().includes(termo) ||

                    ad.categoria?.toLowerCase().includes(termo)

                );

                setResults(filtrados);

            } catch (err) {

                console.error(err);

                setError(err.message);

            } finally {

                setLoading(false);

            }

        }

        buscar();

    }, [query]);

    const getImagemUrl = (ad) => {

        if (

            Array.isArray(ad.imagens) &&

            ad.imagens.length > 0

        ) {

            return getImageUrl(ad.imagens[0]);

        }

        return null;

    };

    return (

        <div className="search-results">

            <div className="container">

                <div className="search-header">

                    <h1>Resultados da busca</h1>

                    <p className="search-query">

                        {query ? `"${query}"` : ""}

                    </p>

                </div>

                {!loading && !error && (

                    <div className="search-stats">

                        {

                            results.length === 0

                                ? <p>Nenhum resultado encontrado</p>

                                : <p>

                                    {results.length}

                                    {" "}

                                    {results.length === 1

                                        ? "anúncio encontrado"

                                        : "anúncios encontrados"}

                                </p>

                        }

                    </div>

                )}

                {

                    loading &&

                    <div className="loading">

                        <div className="spinner"></div>

                        <p>Buscando anúncios...</p>

                    </div>

                }

                {

                    error &&

                    <div className="error">

                        <h3>Erro na busca</h3>

                        <p>{error}</p>

                    </div>

                }

                {

                    !loading &&

                    !error &&

                    (

                        results.length === 0

                            ?

                            <div className="no-results">

                                <span className="no-results-icon">

                                    🔍

                                </span>

                                <h3>

                                    Nenhum resultado encontrado

                                </h3>

                                <p>

                                    Não encontramos anúncios para "{query}"

                                </p>

                                <Link

                                    to="/"

                                    className="btn-primary"

                                >

                                    Voltar para página inicial

                                </Link>

                            </div>

                            :

                            <div className="results-grid">

                                {

                                    results.map((ad) => (

                                        <AdCard

                                            key={ad.id}

                                            ad={ad}

                                            imagemUrl={getImagemUrl(ad)}

                                        />

                                    ))

                                }

                            </div>

                    )

                }

            </div>

        </div>

    );

}

export default SearchResults;