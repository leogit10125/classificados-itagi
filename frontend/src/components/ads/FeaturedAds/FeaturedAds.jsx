import { useEffect, useState } from "react";

import { AdsAPI } from "../../../api";

import { Carousel } from "./components";

import "./FeaturedAds.css";

function FeaturedAds() {

    const [ads, setAds] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function carregar() {

            try {

                const data = await AdsAPI.listar();

                setAds(Array.isArray(data) ? data : []);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        carregar();

    }, []);

    if (loading) {

        return (

            <section className="featured-v2">

                <h2>

                    📢 Anúncios Recentes

                </h2>

                <p>

                    Carregando...

                </p>

            </section>

        );

    }

    return (

        <section className="featured-v2">

            <h2>

                📢 Anúncios Recentes

            </h2>

            <Carousel anuncios={ads} />

        </section>

    );

}

export default FeaturedAds;