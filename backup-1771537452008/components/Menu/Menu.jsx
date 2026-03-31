// src/components/Menu/Menu.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Menu.css"

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [activeDropdown, setActiveDropdown] = useState(null)

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

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
    setActiveDropdown(null)
  }

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(index)
    }
  }

  // E a função handleLogout:
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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

        {/* Hamburger Button */}
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
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            {localStorage.getItem('token') ? (
              <button onClick={handleLogout} className="btn-logout">Sair</button>
            ) : (
              <Link to="/login" onClick={closeMenu}>Entrar</Link>
            )}
          </li>


          {/* Categorias Dropdown */}
          <li className={activeDropdown === 1 ? 'active' : ''}>
            <a 
              href="#categorias" 
              onClick={(e) => {
                e.preventDefault()
                isMobile ? toggleDropdown(1) : null
              }}
            >
              Categorias <i>▼</i>
            </a>
            <ul className="dropdown-menu">
              <li><Link to="/categoria/vendas" onClick={closeMenu}>🏷️ Vendas</Link></li>
              <li><Link to="/categoria/servicos" onClick={closeMenu}>🔧 Serviços</Link></li>
              <li><Link to="/categoria/imoveis" onClick={closeMenu}>🏠 Imóveis</Link></li>
              <li><Link to="/categoria/empregos" onClick={closeMenu}>💼 Empregos</Link></li>
              <li><Link to="/categoria/veiculos" onClick={closeMenu}>🚗 Veículos</Link></li>
              <li><Link to="/categoria/eletronicos" onClick={closeMenu}>📱 Eletrônicos</Link></li>
            </ul>
          </li>

          {/* Blog Dropdown */}
          <li className={activeDropdown === 2 ? 'active' : ''}>
            <a 
              href="#blog" 
              onClick={(e) => {
                e.preventDefault()
                isMobile ? toggleDropdown(2) : null
              }}
            >
              Blog <i>▼</i>
            </a>
            <ul className="dropdown-menu">
              <li><Link to="/blog" onClick={closeMenu}>📰 Todos os posts</Link></li>
              <li><Link to="/blog/categoria/dicas" onClick={closeMenu}>💡 Dicas</Link></li>
              <li><Link to="/blog/categoria/seguranca" onClick={closeMenu}>🔒 Segurança</Link></li>
              <li><Link to="/blog/categoria/marketing" onClick={closeMenu}>📊 Marketing</Link></li>
            </ul>
          </li>

          {/* Institucional Dropdown */}
          <li className={activeDropdown === 3 ? 'active' : ''}>
            <a 
              href="#institucional" 
              onClick={(e) => {
                e.preventDefault()
                isMobile ? toggleDropdown(3) : null
              }}
            >
              Institucional <i>▼</i>
            </a>
            <ul className="dropdown-menu">
              <li><Link to="/sobre" onClick={closeMenu}>📋 Quem Somos</Link></li>
              <li><Link to="/politicas" onClick={closeMenu}>🔐 Políticas</Link></li>
              <li><Link to="/termos" onClick={closeMenu}>📜 Termos</Link></li>
              <li><Link to="/contato" onClick={closeMenu}>📧 Contato</Link></li>
            </ul>
          </li>

          <li className="menu-button">
            <Link to="/anunciar" className="btn-anunciar" onClick={closeMenu}>
              Anunciar
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  )
}

export default Menu