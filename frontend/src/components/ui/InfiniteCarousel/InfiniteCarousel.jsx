import "./InfiniteCarousel.css";

function InfiniteCarousel({ children }) {

    return (

        <div className="infinite-carousel">

            <div className="infinite-carousel-track">

                {children}

            </div>

        </div>

    );

}

export default InfiniteCarousel;