import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Menu.css"

function Menu() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)
  const navigate = useNavigate()

  // Preservando a sua lógica de autenticação exata
  const isLoggedIn = !!localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`)
      closeMenu()
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900)
      if (window.innerWidth > 900) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')    
    localStorage.removeItem('usuario') 
    navigate('/')
    closeMenu()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* LOGO (Fundo azul escuro pede texto branco) */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-wrapper">
            <span className="logo-icon-img">🤝</span>
            <div className="logo-text">
              <strong>ITAGI</strong>
              <span>Classificados</span>
            </div>
          </div>
        </Link>

        {/* ==========================================
           DESKTOP NAVBAR
           ========================================== */}
        {!isMobile && (
          <div className="nav-content-right">
            <div className="desktop-menu">
              <Link to="/" className="active-link">Home</Link>
              <Link to="/categorias">Categorias ▾</Link>
              {isLoggedIn && <Link to="/meus-anuncios">Meus Anúncios</Link>}
              <Link to="/sobre">Sobre ▾</Link>
              <Link to="/contato">Contato</Link>
            </div>

            {/* BUSCA DESKTOP COMPACTA */}
            <form className="search-box-compact" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar anúncios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <div className="action-buttons">
              <Link className="btn-anunciar-yellow" to="/anunciar">
                <span className="icon-plus">+</span> Anunciar
              </Link>

              {isLoggedIn ? (
                <button className="btn-entrar-nav" onClick={handleLogout}>
                  🚪 Sair
                </button>
              ) : (
                <Link className="btn-entrar-nav" to="/login">
                  👤 Entrar
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
           CONTROLES DO TOPO MOBILE
           ========================================== */}
        {isMobile && (
          <div className="mobile-controls">
            <button className="mobile-search-trigger" onClick={toggleMenu}>🔍</button>
            <Link className="btn-anunciar-yellow mobile-compact-btn" to="/anunciar">
              + Anunciar
            </Link>
            <button className="hamburger" onClick={toggleMenu}>
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        )}

        {/* ==========================================
           MENU LATERAL MOBILE (Com o design do mockup)
           ========================================== */}
        {isMobile && isOpen && (
          <>
            <div className="mobile-menu-overlay" onClick={closeMenu} />
            <div className="mobile-menu animate-slide-in">
              
              {/* Se logado, mostra o Card do Usuário no topo do Menu Lateral */}
              {isLoggedIn && (
                <div className="mobile-user-card">
                  <div className="mobile-avatar">
                    {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="mobile-user-info">
                    <strong>{usuario.nome || "Usuário"}</strong>
                    <span>{usuario.email || "Bem-vindo"}</span>
                    <small>Online</small>
                  </div>
                </div>
              )}

              {/* Barra de Busca dentro do Menu */}
              <form className="mobile-search" onSubmit={handleSearch}>
                <input
                  placeholder="O que você procura?..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              {/* LINKS CONDICIONAIS MOBILE */}
              <div className="mobile-links-list">
                <Link to="/" onClick={closeMenu}>🏠 Início</Link>

                {isLoggedIn ? (
                  /* LINKS USUÁRIO LOGADO */
                  <>
                    <Link to="/perfil" onClick={closeMenu}>👤 Meu Painel</Link>
                    <Link to="/meus-anuncios" onClick={closeMenu}>📱 Meus anúncios</Link>
                    <Link to="/destaques" onClick={closeMenu}>⭐ Destaques</Link>
                    <Link to="/favoritos" onClick={closeMenu}>❤️ Favoritos</Link>
                    <Link to="/creditos" onClick={closeMenu}>💳 Créditos</Link>
                    
                    <Link className="mobile-anunciar-btn" to="/anunciar" onClick={closeMenu}>
                      ➕ Novo anúncio
                    </Link>
                    
                    <button className="mobile-logout-btn" onClick={handleLogout}>
                      🚪 Sair da Conta
                    </button>
                  </>
                ) : (
                  /* LINKS USUÁRIO DESLOGADO */
                  <>
                    <Link to="/categorias" onClick={closeMenu}>📂 Categorias</Link>
                    <Link to="/destaques" onClick={closeMenu}>🔥 Destaques</Link>
                    <Link to="/blog" onClick={closeMenu}>📰 Blog</Link>
                    <Link to="/como-anunciar" onClick={closeMenu}>❓ Como anunciar</Link>
                    <Link to="/sobre" onClick={closeMenu}>🏢 Quem Somos</Link>
                    <Link to="/contato" onClick={closeMenu}>☎️ Contato</Link>
                    
                    <hr className="menu-divider" />
                    
                    <Link to="/login" className="mobile-login-link" onClick={closeMenu}>🔑 Entrar</Link>
                    <Link to="/registro" className="mobile-register-link" onClick={closeMenu}>📝 Criar Conta</Link>
                    
                    <Link className="mobile-anunciar-btn" to="/anunciar" onClick={closeMenu}>
                      ➕ Novo anúncio
                    </Link>
                  </>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </nav>
  )
}

export default Menu