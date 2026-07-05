import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Header.css"

function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>

      <div className="header-logo">
        📍 ITAGI <span>Classificados</span>
      </div>

      <nav className="header-nav">
        <Link to="/">🏠 Início</Link>
        <Link to="/categorias">📂 Categorias</Link>
        <Link to="/contato">☎ Contato</Link>
        <Link to="/perfil">👤 Meu Perfil</Link>

        <Link to="/anunciar" className="btn btn-primary btn-sm">
          ➕ Anunciar
        </Link>
      </nav>

      <form onSubmit={handleSearch} className="header-search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar anúncios..."
        />

        <button className="btn btn-primary btn-sm">
          🔍
        </button>
      </form>

    </header>
  )
}

export default Header