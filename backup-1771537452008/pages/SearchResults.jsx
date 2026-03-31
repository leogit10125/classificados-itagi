// src/pages/SearchResults.jsx
import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import AdCard from "../components/AdCard/AdCard"
import "./SearchResults.css"

// URL da API (igual ao Home.jsx e CategoryPage.jsx)
const API_URL = 'http://localhost:5000/api'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      
      try {
        if (!query.trim()) {
          setResults([])
          setLoading(false)
          return
        }

        // Buscar resultados da API
        const response = await fetch(`${API_URL}/ads?search=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        setResults(data)
        setLoading(false)
      } catch (error) {
        console.error('Erro na busca:', error)
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  return (
    <div className="search-results-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <span>Busca por: "{query}"</span>
        </div>

        <div className="search-header">
          <h1>Resultados da busca</h1>
          <p className="search-info">
            {loading ? "Buscando..." : `${results.length} ${results.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}`}
          </p>
        </div>

        {loading ? (
          <div className="loading">Carregando resultados...</div>
        ) : (
          <>
            {results.length === 0 ? (
              <div className="no-results">
                <p>Nenhum anúncio encontrado para "{query}"</p>
                <p>Sugestões:</p>
                <ul>
                  <li>Verifique a ortografia</li>
                  <li>Tente termos mais genéricos</li>
                  <li>Navegue por categorias</li>
                </ul>
                <Link to="/" className="btn-primary">
                  Voltar para página inicial
                </Link>
              </div>
            ) : (
              <div className="results-grid">
                {results.map(ad => (
                  <AdCard key={ad.id} {...ad} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults