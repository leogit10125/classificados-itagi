import { Link } from "react-router-dom";
import CategoryIcon from "./CategoryIcon";

import "./CategoryCard.css";

function CategoryCard({ categoria }) {

    return (

        <Link
            to={`/categoria/${categoria.slug}`}
            className="category-card"
        >

            <div className="category-icon-wrapper">

                <CategoryIcon
                    slug={categoria.slug}
                />

            </div>

            <h3>

                {categoria.nome}

            </h3>

            <span>

                {categoria.total || 0} anúncios

            </span>

        </Link>

    );

}

export default CategoryCard;