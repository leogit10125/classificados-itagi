import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Menu.css"

function Menu() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()

  // Verificar se usuário está logado
  const isLoggedIn = !!localStorage.getItem('token')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`)
      closeMenu()
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  
  const closeMenu = () => {
    setIsOpen(false)
    setActiveDropdown(null)
  }

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')    // Limpa se existir 'user'
    localStorage.removeItem('usuario') // Limpa o 'usuario' que usamos no MeusAnuncios
    navigate('/')
    closeMenu()
  }

  return (
    <nav className="menu">
      <div className="menu-container">
        {/* Logo */}
        <div className="menu-logo">
          <Link to="/" onClick={closeMenu}>
            <h1>Itagi</h1>
            <span>Classificados</span>
          </Link>
        </div>

        {/* Barra de busca (Desktop) */}
        {!isMobile && (
          <form onSubmit={handleSearch} className="menu-search">
            <input
              type="text"
              placeholder="Buscar anúncios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        )}

        {/* Hamburger Button (Mobile) */}
        {isMobile && (
          <button 
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        {/* Menu Items */}
        <ul className={`menu-items ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''}`}>
          
          {/* Busca mobile */}
          {isMobile && (
            <li className="mobile-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Buscar anúncios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">🔍</button>
              </form>
            </li>
          )}

          <li><Link to="/" onClick={closeMenu}>Home</Link></li>

          {/* Categorias */}
          <li className={`dropdown ${activeDropdown === 1 ? 'active' : ''}`}>
            <a href="#categorias" onClick={(e) => { e.preventDefault(); isMobile && toggleDropdown(1) }}>
              Categorias <i>▼</i>
            </a>
            <ul className="dropdown-menu">
              <li><Link to="/categoria/vendas" onClick={closeMenu}>🏷️ Vendas</Link></li>
              <li><Link to="/categoria/servicos" onClick={closeMenu}>🔧 Serviços</Link></li>
              <li><Link to="/categoria/imoveis" onClick={closeMenu}>🏠 Imóveis</Link></li>
              <li><Link to="/categoria/veiculos" onClick={closeMenu}>🚗 Veículos</Link></li>
            </ul>
          </li>

          {/* ÁREA DO USUÁRIO LOGADO ✅ */}
          {isLoggedIn && (
            <li>
              <Link to="/meus-anuncios" onClick={closeMenu} style={{fontWeight: 'bold', color: '#4361ee'}}>
                ✨ Meus Anúncios
              </Link>
            </li>
          )}

          {/* Institucional */}
          <li className={`dropdown ${activeDropdown === 3 ? 'active' : ''}`}>
            <a href="#institucional" onClick={(e) => { e.preventDefault(); isMobile && toggleDropdown(3) }}>
              Sobre <i>▼</i>
            </a>
            <ul className="dropdown-menu">
              <li><Link to="/sobre" onClick={closeMenu}>Quem Somos</Link></li>
              <li><Link to="/contato" onClick={closeMenu}>Contato</Link></li>
            </ul>
          </li>

          {/* Login/Logout */}
          <li className="auth-item">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn-logout">Sair</button>
            ) : (
              <Link to="/login" onClick={closeMenu}>Entrar</Link>
            )}
          </li>

          {/* Botão Anunciar */}
          <li className="menu-button">
            <Link to="/anunciar" className="btn-anunciar" onClick={closeMenu}>
              Anunciar
            </Link>
          </li>
        </ul>
      </div>

      {isMobile && isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </nav>
  )
}

export default Menu