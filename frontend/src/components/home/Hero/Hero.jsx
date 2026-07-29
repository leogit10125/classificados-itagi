import { useEffect, useState } from "react";

import { AdsAPI } from "../../../api";

import HeroContent from "./components/HeroContent";
import HeroImageCard from "./components/HeroImageCard";
import HeroPriceBox from "./components/HeroPriceBox";
import HeroDots from "./components/HeroDots";

import "./Hero.css";

function HeroPremium() {

    const [ads, setAds] = useState([]);
    const [current, setCurrent] = useState(0);

    // Carrega anúncios em destaque
    useEffect(() => {

        async function carregar() {

            try {

                const data = await AdsAPI.destaques();

                setAds(Array.isArray(data) ? data : []);

            } catch (err) {

                console.error("Erro ao carregar destaques:", err);

                setAds([]);

            }

        }

        carregar();

    }, []);

    // Garante índice válido
    useEffect(() => {

        if (ads.length && current >= ads.length) {

            setCurrent(0);

        }

    }, [ads, current]);

    // Autoplay
    useEffect(() => {

        if (ads.length <= 1) return;

        const timer = setInterval(() => {

            setCurrent((prev) => (prev + 1) % ads.length);

        }, 5000);

        return () => clearInterval(timer);

    }, [ads]);

    if (!ads.length) {

        return (

            <section className="hero-premium hero-loading">

                <p>Carregando anúncios em destaque...</p>

            </section>

        );

    }

    const ad = ads[current];

    return (

        <section className="hero-premium">

            <div className="hero-premium-content">

                <HeroContent ad={ad} />

                <HeroImageCard ad={ad} />

                <HeroPriceBox ad={ad} />

            </div>

            <HeroDots
                total={ads.length}
                current={current}
                onChange={setCurrent}
            />

        </section>

    );

}

export default HeroPremium;