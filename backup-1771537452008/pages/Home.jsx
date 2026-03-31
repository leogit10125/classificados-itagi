// src/pages/Home.jsx
import { useState, useEffect } from "react"
import Hero from "../components/Hero/Hero"
import Categories from "../components/Categories/Categories"
import AdsCarousel from "../components/AdsCarousel/AdsCarousel"
import AdCard from "../components/AdCard/AdCard"
import "./Home.css"

// URL da API (pode mover para um arquivo .env depois)
const API_URL = 'http://localhost:5000/api'

function Home() {
  const [featuredAds, setFeaturedAds] = useState([])
  const [recentAds, setRecentAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Buscar anúncios da API
        const response = await fetch(`${API_URL}/ads`)
        const data = await response.json()
        
        // Separar em destaque e recentes
        const featured = data.filter(ad => ad.destaque === 1 || ad.destaque === true)
        const recent = [...data].sort((a, b) => 
          new Date(b.criado_em) - new Date(a.criado_em)
        ).slice(0, 8)

        setFeaturedAds(featured.length > 0 ? featured : data.slice(0, 7))
        setRecentAds(recent)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar anúncios:', error)
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  if (loading) {
    return (
      <>
        <Hero />
        <Categories />
        <section className="home-section">
          <div className="container">
            <h2 className="section-title">🔥 Destaques da semana</h2>
            <p>Carregando anúncios...</p>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Hero />
      <Categories />
      
      <section className="home-section">
        <div className="container">
          <h2 className="section-title">🔥 Destaques da semana</h2>
          {featuredAds.length > 0 ? (
            <AdsCarousel ads={featuredAds} />
          ) : (
            <p>Nenhum anúncio em destaque no momento.</p>
          )}
        </div>
      </section>

      <section className="home-section bg-light">
        <div className="container">
          <h2 className="section-title">📦 Anúncios recentes</h2>
          {recentAds.length > 0 ? (
            <div className="ads-grid">
              {recentAds.map(ad => (
                <AdCard key={ad.id} {...ad} />
              ))}
            </div>
          ) : (
            <p>Nenhum anúncio encontrado.</p>
          )}
        </div>
      </section>
    </>
  )
}

export default Home