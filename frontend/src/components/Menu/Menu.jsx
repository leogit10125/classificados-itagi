import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/bandeira-itagi.png";
import "./Menu.css";

function Menu() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);

    closeMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");

    closeMenu();

    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <Link to="/" className="logo" onClick={closeMenu}>
            <img
                src={logo}
                alt="Bandeira de Itagi"
                className="logo-image"
            />
        </Link>

        {/* Busca Desktop */}

      
        {/* Desktop */}

        {!isMobile && (
          <div className="desktop-menu">

            <Link to="/" onClick={closeMenu}>
              Início
            </Link>

            <Link
              to="/categoria/vendas"
              onClick={closeMenu}
            >
              Categorias
            </Link>

            {isLoggedIn && (
              <Link
                to="/meus-anuncios"
                onClick={closeMenu}
              >
                Meus anúncios
              </Link>
            )}

            {isLoggedIn ? (
              <button
                className="logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Entrar
              </Link>
            )}

            <Link
              to="/anunciar"
              className="menu-btn"
              onClick={closeMenu}
            >
              + Anunciar
            </Link>

          </div>
        )}

        {/* Mobile */}

        {isMobile && (
          <>
            <button
              className="hamburger"
              onClick={toggleMenu}
            >
              ☰
            </button>

            {isOpen && (
              <>
                <div
                  className="menu-backdrop"
                  onClick={closeMenu}
                />

                <aside className="mobile-menu">

                  <form
                    className="mobile-search"
                    onSubmit={handleSearch}
                  >
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />
                  </form>

                  <Link
                    to="/"
                    onClick={closeMenu}
                  >
                    🏠 Início
                  </Link>

                  <Link
                    to="/categoria/vendas"
                    onClick={closeMenu}
                  >
                    📂 Categorias
                  </Link>

                  {isLoggedIn && (
                    <Link
                      to="/meus-anuncios"
                      onClick={closeMenu}
                    >
                      📢 Meus anúncios
                    </Link>
                  )}

                  <Link
                    to="/contato"
                    onClick={closeMenu}
                  >
                    ☎ Contato
                  </Link>

                  {isLoggedIn ? (
                    <button
                      className="logout-mobile"
                      onClick={handleLogout}
                    >
                      🚪 Sair
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                    >
                      👤 Entrar
                    </Link>
                  )}

                  <Link
                    className="mobile-anunciar"
                    to="/anunciar"
                    onClick={closeMenu}
                  >
                    ➕ Anunciar
                  </Link>

                </aside>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Menu;