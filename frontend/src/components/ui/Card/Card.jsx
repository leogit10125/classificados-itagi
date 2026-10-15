import "./Card.css";

function Card({children}){

    return(

        <div className="card-ui">

            {children}

        </div>

    )

}

export default Card;