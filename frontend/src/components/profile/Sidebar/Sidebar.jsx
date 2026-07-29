import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const usuario =
        JSON.parse(localStorage.getItem("usuario")) || {};

    function sair(){

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/");

    }

    return (

        <aside className="profile-sidebar">

            <div className="sidebar-user">

                <div className="avatar">
                    {usuario.nome?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <h3>{usuario.nome}</h3>

                <p>{usuario.email}</p>

                <span className="plano">
                    Plano Gratuito
                </span>

            </div>

            <nav>

                <Link to="/">🏠 Início</Link>

                <Link to="/perfil">👤 Dashboard</Link>

                <Link to="/meus-anuncios">📱 Meus anúncios</Link>

                <Link to="/destaques">⭐ Destaques</Link>

                <Link to="/favoritos">❤️ Favoritos</Link>

                <Link to="/creditos">💳 Créditos</Link>

                <Link to="/blog">📰 Blog</Link>

                <Link to="/como-funciona">
                    ❓ Como funciona
                </Link>

                <Link to="/sobre">
                    🏢 Quem Somos
                </Link>

                <Link to="/contato">
                    ✉ Contato
                </Link>

            </nav>

            <button
                className="logout-button"
                onClick={sair}
            >
                🚪 Sair
            </button>

            <Link
                className="novo-anuncio"
                to="/anunciar"
            >
                ➕ Novo anúncio
            </Link>

        </aside>

    );

}

export default Sidebar;