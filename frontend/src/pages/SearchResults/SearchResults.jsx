// src/pages/SearchResults/SearchResults.jsx
import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"  
import AdCard from "../../components/AdCard/AdCard"
import "./SearchResults.css"

const API_URL = 'http://localhost:3000/api'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (!query) return
    
    const searchAds = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log(`🔍 Buscando por: "${query}"`)
        
        // Buscar todos os anúncios
        const response = await fetch(`${API_URL}/ads`)
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        
        const allAds = await response.json()
        
        // Filtrar localmente (case insensitive)
        const searchTerm = query.toLowerCase()
        const filtered = allAds.filter(ad => {
          return (
            ad.titulo?.toLowerCase().includes(searchTerm) ||
            ad.descricao?.toLowerCase().includes(searchTerm) ||
            ad.categoria?.toLowerCase().includes(searchTerm)
          )
        })
        
        console.log(`✅ Encontrados: ${filtered.length} resultados`)
        setResults(filtered)
        
      } catch (error) {
        console.error('❌ Erro na busca:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    searchAds()
  }, [query])

  const getImagemUrl = (ad) => {
    if (ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
      return `http://localhost:3000/uploads/${ad.imagens[0]}`
    }
    return null
  }

  return (
    <div className="search-results">
      <div className="container">
        {/* Cabeçalho */}
        <div className="search-header">
          <h1>Resultados da busca</h1>
          <p className="search-query">
            {query ? `"${query}"` : ''}
          </p>
        </div>

        {/* Estatísticas */}
        {!loading && !error && (
          <div className="search-stats">
            {results.length === 0 ? (
              <p>Nenhum resultado encontrado</p>
            ) : (
              <p>{results.length} {results.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}</p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Buscando anúncios...</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="error">
            <h3>❌ Erro na busca</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Resultados */}
        {!loading && !error && (
          <>
            {results.length === 0 ? (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <h3>Nenhum resultado encontrado</h3>
                <p>Não encontramos anúncios para "{query}"</p>
                <p className="suggestion">Tente usar palavras mais genéricas</p>
                <Link to="/" className="btn-primary">
                  Voltar para página inicial
                </Link>
              </div>
            ) : (
              <div className="results-grid">
                {results.map(ad => (
                  <AdCard 
                    key={ad.id} 
                    ad={ad}
                    imagemUrl={getImagemUrl(ad)}
                  />
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