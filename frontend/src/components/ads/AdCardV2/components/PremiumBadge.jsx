import "./PremiumBadge.css";

function PremiumBadge({ anuncio }) {

    if (!anuncio?.destaque) return null;

    return (

        <div className="premium-badge">

            ⭐ Destaque

        </div>

    );

}

export default PremiumBadge;