// src/components/Hero/Hero.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Hero.css"

function Hero() {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Compre, venda e anuncie em <span className="itagi-text">Itagi</span>
        </h1>
        <p>Encontre produtos, imóveis e serviços na sua cidade</p>
        
        <form className="hero-search" onSubmit={handleSearch}>
          <input 
            type="text"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </div>
    </section>
  )
}

export default Hero