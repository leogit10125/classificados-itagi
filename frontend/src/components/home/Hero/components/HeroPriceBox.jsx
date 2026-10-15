import "./HeroPriceBox.css";

function HeroPriceBox({ ad }) {

    if (!ad) return null;

    const preco = Number(ad.preco || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (

        <div className="hero-price-box">

            <span className="hero-price-label">
                A partir de
            </span>

            <h2>
                R$ {preco}
            </h2>

        </div>

    );

}

export default HeroPriceBox;