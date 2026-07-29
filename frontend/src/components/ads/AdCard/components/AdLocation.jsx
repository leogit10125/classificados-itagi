import "./AdLocation.css";

function AdLocation({ localizacao }){

    return(

        <div className="ad-location">

            📍 {localizacao || "Itagi"}

        </div>

    );

}

export default AdLocation;