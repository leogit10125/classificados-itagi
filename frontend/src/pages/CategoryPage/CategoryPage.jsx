import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import AdCard from "../../components/ads/AdCard/AdCard";
import { UPLOADS_URL } from "../../config/api";
import { CategoriasAPI } from "../../api";



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

            const ads = await CategoriasAPI.slug(slug);

            setCategoryAds(Array.isArray(ads) ? ads : []);

            setCategoryInfo(

                categoriesMap[slug] || {

                    name: slug.charAt(0).toUpperCase() + slug.slice(1),

                    icon: "📂"

                }

            );

            setError(null);

        } catch (err) {

            console.error(err);

            setError(err.message || "Erro ao carregar categoria.");

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

                    (a, b) => Number(a.preco || 0) - Number(b.preco || 0)

                );

            case "priceDesc":

                return lista.sort(

                    (a, b) => Number(b.preco || 0) - Number(a.preco || 0)

                );

            default:

                return lista.sort(

                    (a, b) =>

                        new Date(b.criado_em || 0) -

                        new Date(a.criado_em || 0)

                );

        }

    }, [categoryAds, sortBy]);

    const getImagemUrl = (ad) => {

        if (

            Array.isArray(ad.imagens) &&

            ad.imagens.length > 0

        ) {

            return `${UPLOADS_URL}/${ad.imagens[0]}`;

        }

        return null;

    };

    if (error) {

        return (

            <div className="category-page">

                <div className="container">

                    <div className="error-state">

                        <h2>❌ Erro ao carregar</h2>

                        <p>{error}</p>

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

            {/* todo o restante do JSX permanece igual */}

            {/* Apenas troque */}

            {/* categoryAds.map */}

            {/* por */}

            {/* anunciosOrdenados.map */}

        </div>

    );

}

export default CategoryPage;