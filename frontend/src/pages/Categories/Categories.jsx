import { Link } from "react-router-dom";

import Categories from "../../components/home/Categories/Categories";
import FeaturedAds from "../../components/home/FeaturedAds/FeaturedAds";
import Stats from "../../components/home/Stats/Stats";

import "./Categories.css";

function CategoriesPage() {

    return (

        <main className="categories-page">

            <section className="categories-hero">

                <h1>Explore as Categorias</h1>

                <p>
                    Encontre rapidamente o que procura em Itagi e região.
                </p>

            </section>

            <section className="categories-grid">

                <Categories />

            </section>

            <section className="featured-section">

                <h2>Categorias em destaque</h2>

                <FeaturedAds />

            </section>

            <section className="stats-section">

                <Stats />

            </section>

            <section className="cta-section">

                <h2>Tem algo para vender?</h2>

                <p>
                    Anuncie gratuitamente em poucos minutos.
                </p>

                <Link
                    className="cta-button"
                    to="/anunciar"
                >
                    ➕ Quero anunciar
                </Link>

            </section>

        </main>

    );

}

export default CategoriesPage;