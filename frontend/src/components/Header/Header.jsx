// src/components/Header/Header.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Header.css"

function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault() // 👈 IMPEDE O RECARREGAMENTO DA PÁGINA
    
    if (searchTerm.trim()) {
      console.log('🔍 Buscando por:', searchTerm)
      // 👈 NAVEGA PARA A PÁGINA DE RESULTADOS
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      alert('Digite algo para buscar')
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-area">
            <h1>Itagi</h1>
            <span>CLASSIFICADOS</span>
          </div>
          <p className="slogan">Compre, venda e anuncie em Itagi e região</p>
        </div>

        {/* FORMULÁRIO DE BUSCA - CORRIGIDO */}
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>

        {/* ESTATÍSTICAS */}
        <div className="stats">
          <div className="stat-item">
            <strong>1.2k+</strong>
            <span>ANÚNCIOS</span>
          </div>
          <div className="stat-item">
            <strong>5+</strong>
            <span>USUÁRIOS</span>
          </div>
          <div className="stat-item">
            <strong>40+</strong>
            <span>CATEGORIAS</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header