import "./ScrollButton.css";

function ScrollButton({ direction = "left", onClick }) {

    return (

        <button
            className={`carousel-button ${direction}`}
            onClick={onClick}
        >

            {direction === "left" ? "‹" : "›"}

        </button>

    );

}

export default ScrollButton;