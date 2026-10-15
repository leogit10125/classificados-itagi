import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedAds from "../../components/ads/FeaturedAds";

//import HeroSlider from "../../components/home/HeroSlider/HeroSlider";
import Hero from "../../components/home/Hero/Hero";
import Categories from "../../components/home/Categories/Categories";
//import AdsCarousel from "../../components/ads/AdsCarousel/AdsCarousel";

import { AdsAPI } from "../../api";

import "./Home.css";

function Home() {

    const navigate = useNavigate();

    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAds = useCallback(async () => {

        try {

            setLoading(true);

            const data = await AdsAPI.listar();

            setAnuncios(Array.isArray(data) ? data : []);

            setError(null);

        } catch (err) {

            console.error("Erro ao carregar anúncios:", err);

            setError(err.message || "Erro ao carregar anúncios.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        fetchAds();

    }, [fetchAds]);

    const anunciosDestaque = anuncios.slice(0, 6);

    return (

        <div className="home-page">

            
            <Hero />

            <Categories />

            <section className="featured-ads-section">

                <div className="featured-container">

                    

                    {loading && (

                        <div className="loading-state">

                            <div className="spinner"></div>

                            <p>Carregando anúncios...</p>

                        </div>

                    )}

                    {!loading && error && (

                        <div className="error-state">

                            <h3>Erro ao carregar anúncios</h3>

                            <p>{error}</p>

                            <button
                                className="retry-button"
                                onClick={fetchAds}
                            >

                                🔄 Tentar novamente

                            </button>

                        </div>

                    )}

                    {!loading && !error && anuncios.length === 0 && (

                        <div className="empty-state">

                            <p>

                                📭 Ainda não existem anúncios publicados.

                            </p>

                            <button
                                className="create-ad-btn"
                                onClick={() => navigate("/anunciar")}
                            >

                                ➕ Publicar primeiro anúncio

                            </button>

                        </div>

                    )}

                    {!loading && !error && anuncios.length > 0 && (

                        <>

                          

                            <>
                               

                                <FeaturedAds
                                    anuncios={anuncios}
                                />
                            </> 

                        </>

                    )}

                </div>

            </section>

        </div>

    );

}

export default Home;