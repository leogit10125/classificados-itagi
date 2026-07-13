import { useEffect, useState } from "react";

import HeroSlide from "./components/HeroSlide";
import HeroDots from "./components/HeroDots";

import "./HeroSlider.css";

const API_URL = "http://localhost:3000/api";

function HeroSlider() {

    const [ads, setAds] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {

        async function carregar() {

            const response = await fetch(`${API_URL}/ads/destaques`);
            const data = await response.json();

            setAds(Array.isArray(data) ? data : []);

        }

        carregar();

    }, []);
    

    useEffect(() => {

        if (!ads.length) return;

        const timer = setInterval(() => {

            setCurrent((prev) =>
                prev === ads.length - 1 ? 0 : prev + 1
            );

        }, 5000);

        return () => clearInterval(timer);

    }, [ads]);

    if (!ads.length) {

        return (
            <section className="hero-slider">
                Carregando...
            </section>
        );

    }

    const anuncio = ads[current];

    return (

        <section className="hero-slider">

            <HeroSlide ad={anuncio} />

            <HeroDots
                total={ads.length}
                current={current}
                onChange={setCurrent}
            />

        </section>

    );

}

export default HeroSlider;