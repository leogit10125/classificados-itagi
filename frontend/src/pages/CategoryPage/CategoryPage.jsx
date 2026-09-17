import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import AdCard from "../../components/ads/AdCard/AdCard";
import { CategoriasAPI } from "../../api";
import { categories } from "../../data/mockAds";

import "./CategoryPage.css";

function CategoryPage() {

    const { slug } = useParams();

    const [categoryAds, setCategoryAds] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [sortBy, setSortBy] = useState("recent");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const carregarCategoria = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const ads = await CategoriasAPI.slug(slug);

            setCategoryAds(
                Array.isArray(ads) ? ads : []
            );


            const categoria = categories.find(
                (category) => category.slug === slug
            );


            setCategoryInfo(
                categoria || {
                    name:
                        slug.charAt(0).toUpperCase() +
                        slug.slice(1),

                    icon: "📂"
                }
            );


        } catch (err) {

            console.error(
                "Erro ao carregar categoria:",
                err
            );

            setError(
                err.message ||
                "Erro ao carregar categoria."
            );

        } finally {

            setLoading(false);

        }

    }, [slug]);


    useEffect(() => {

        if (slug) {
            carregarCategoria();
        }

    }, [slug, carregarCategoria]);


    const anunciosOrdenados = useMemo(() => {

        const lista = [...categoryAds];

        switch (sortBy) {

            case "priceAsc":

                return lista.sort(
                    (a, b) =>
                        Number(a.preco || 0) -
                        Number(b.preco || 0)
                );


            case "priceDesc":

                return lista.sort(
                    (a, b) =>
                        Number(b.preco || 0) -
                        Number(a.preco || 0)
                );


            default:

                return lista.sort(
                    (a, b) =>
                        new Date(b.criado_em || 0) -
                        new Date(a.criado_em || 0)
                );

        }

    }, [categoryAds, sortBy]);


    if (loading) {

        return (

            <div className="category-page">

                <div className="container">

                    <div className="loading-state">

                        <p>
                            Carregando anúncios...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="category-page">

                <div className="container">

                    <div className="error-state">

                        <h2>
                            ❌ Erro ao carregar
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="btn-primary"
                            onClick={carregarCategoria}
                        >
                            Tentar novamente
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="category-page">

            <div className="container">


                {/* VOLTAR */}

                <Link
                    to="/categorias"
                    className="category-back"
                >
                    ← Todas as categorias
                </Link>


                {/* CABEÇALHO DA CATEGORIA */}

                <div className="category-header">

                    <div className="category-title">

                        <span className="category-title-icon">
                            {categoryInfo?.icon || "📂"}
                        </span>

                        <div>

                            <h1>
                                {categoryInfo?.name || slug}
                            </h1>

                            <p>
                                {categoryAds.length}{" "}

                                {categoryAds.length === 1
                                    ? "anúncio encontrado"
                                    : "anúncios encontrados"}
                            </p>

                        </div>

                    </div>


                    {/* ORDENAÇÃO */}

                    <div className="category-sort">

                        <label htmlFor="category-sort">
                            Ordenar:
                        </label>

                        <select
                            id="category-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >

                            <option value="recent">
                                Mais recentes
                            </option>

                            <option value="priceAsc">
                                Menor preço
                            </option>

                            <option value="priceDesc">
                                Maior preço
                            </option>

                        </select>

                    </div>

                </div>


                {/* LISTA DE ANÚNCIOS */}

                {anunciosOrdenados.length > 0 ? (

                    <section className="category-ads">

                        {anunciosOrdenados.map((anuncio) => (

                            <AdCard
                                key={anuncio.id}
                                anuncio={anuncio}
                            />

                        ))}

                    </section>

                ) : (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            📭
                        </div>

                        <h2>
                            Nenhum anúncio encontrado
                        </h2>

                        <p>
                            Ainda não existem anúncios
                            nesta categoria.
                        </p>

                        <Link
                            to="/anunciar"
                            className="btn-primary"
                        >
                            + Criar anúncio
                        </Link>

                    </div>

                )}

            </div>

        </div>

    );

}

export default CategoryPage;