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
<nav className="navbar">

  <div className="navbar-container">

    {/* LOGO */}
    <Link to="/" className="logo" onClick={closeMenu}>
      <div className="logo-icon">📍</div>

      <div className="logo-text">
        <strong>ITAGI</strong>
        <span>Classificados</span>
      </div>
    </Link>

    {/* BUSCA DESKTOP */}
    {!isMobile && (
      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary btn-md">
    📢 Anunciar
</button>
      </form>
    )}

    {/* MENU */}
    {!isMobile && (

    <div className="desktop-menu">

      <Link to="/">Início</Link>

      <Link to="/categoria/vendas">Categorias</Link>

      {isLoggedIn && (
        <Link to="/meus-anuncios">
          Meus anúncios
        </Link>
      )}

      {isLoggedIn ? (
        <button
        className="logout"
        onClick={handleLogout}>
          Sair
        </button>
      ) : (
        <Link to="/login">
          Entrar
        </Link>
      )}

      <Link
      className="anunciar"
      to="/anunciar">
        + Anunciar
      </Link>

    </div>

    )}

    {/* MOBILE */}

    {isMobile && (

      <>

      <button
      className="hamburger"
      onClick={toggleMenu}>

      ☰

      </button>

      {isOpen && (

      <div className="mobile-menu">

      <form
      className="mobile-search"
      onSubmit={handleSearch}>

      <input
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e)=>setSearchTerm(e.target.value)}
      />

      </form>

      <Link to="/" onClick={closeMenu}>
      🏠 Início
      </Link>

      <Link
      to="/categoria/vendas"
      onClick={closeMenu}>
      📂 Categorias
      </Link>

      {isLoggedIn && (
      <Link
      to="/meus-anuncios"
      onClick={closeMenu}>
      📱 Meus anúncios
      </Link>
      )}

      <Link
      to="/contato"
      onClick={closeMenu}>
      ☎ Contato
      </Link>

      <Link
      className="mobile-anunciar"
      to="/anunciar">
      ➕ Anunciar
      </Link>

      </div>

      )}

      </>

    )}

  </div>

</nav>
)
}

export default Menu