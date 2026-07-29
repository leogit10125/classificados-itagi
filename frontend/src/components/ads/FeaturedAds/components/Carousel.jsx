import { useRef } from "react";

import AdCard from "../../AdCard";

import ScrollButton from "./ScrollButton";

import "./Carousel.css";

function Carousel({ anuncios = [] }) {

    const sliderRef = useRef(null);

    function scrollLeft(){

        sliderRef.current.scrollBy({

            left:-900,

            behavior:"smooth"

        });

    }

    function scrollRight(){

        sliderRef.current.scrollBy({

            left:900,

            behavior:"smooth"

        });

    }

    return(

        <div className="featured-carousel">

            <ScrollButton
                direction="left"
                onClick={scrollLeft}
            />

            <div
                className="featured-track"
                ref={sliderRef}
            >

                {anuncios.map(anuncio=>(

                    <AdCard

                        key={anuncio.id}

                        anuncio={anuncio}

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

export default Carousel;