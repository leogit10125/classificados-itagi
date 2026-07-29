import { Heart } from "lucide-react";

import "./FavoriteButton.css";

function FavoriteButton() {

    return (

        <button
            className="favorite-button"
            type="button"
        >

            <Heart size={20} />

        </button>

    );

}

export default FavoriteButton;