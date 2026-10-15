import { useEffect, useState } from "react";

import { CategoriasAPI } from "../../../api";

import { CategoryCarousel } from "./components";

import "./Categories.css";

function Categories() {

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {

        async function carregar() {

            try {

                const data = await CategoriasAPI.listar();

                setCategorias(Array.isArray(data) ? data : []);

            } catch (err) {

                console.error(err);

            }

        }

        carregar();

    }, []);

    return (

        <section className="categories">

            <div className="categories-header">

                <span className="section-badge">

                    Categorias

                </span>

               

            </div>


            <CategoryCarousel categorias={categorias} />

            
        </section>

    );

}

export default Categories;