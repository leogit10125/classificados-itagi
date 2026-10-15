import "./AdPrice.css";

function AdPrice({ preco }) {

    const valor = Number(preco || 0).toLocaleString("pt-BR",{

        minimumFractionDigits:2

    });

    return(

        <div className="ad-price">

            R$ {valor}

        </div>

    );

}

export default AdPrice;