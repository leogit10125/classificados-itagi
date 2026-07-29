import "./ScrollButton.css";

function ScrollButton({ direction = "left", onClick }) {

    return (

        <button
            className={`scroll-button ${direction}`}
            onClick={onClick}
            type="button"
        >

            {direction === "left" ? "❮" : "❯"}

        </button>

    );

}

export default ScrollButton;