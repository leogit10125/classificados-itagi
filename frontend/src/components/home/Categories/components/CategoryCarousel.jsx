import { useRef } from "react";

import CategoryCard from "./CategoryCard";
import ScrollButton from "./ScrollButton";

import "./CategoryCarousel.css";

function CategoryCarousel({ categorias }) {

    const listRef = useRef(null);

    function scrollLeft() {

        listRef.current?.scrollBy({

            left: -320,

            behavior: "smooth"

        });

    }

    function scrollRight() {

        listRef.current?.scrollBy({

            left: 320,

            behavior: "smooth"

        });

    }

    return (

        <div className="category-carousel">

            <ScrollButton
                direction="left"
                onClick={scrollLeft}
            />

            <div
                className="categories-grid"
                ref={listRef}
            >

                {categorias.map((categoria)=>(

                    <CategoryCard

                        key={categoria.slug}

                        categoria={categoria}

                    />

                ))}

            </div>

            <ScrollButton
                direction="right"
                onClick={scrollRight}
            />

        </div>

    );

}

export default CategoryCarousel;