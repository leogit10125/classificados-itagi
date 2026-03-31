// src/pages/CategoryPage/CategoryPage.jsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import AdCard from "../../components/AdCard/AdCard"
import "./CategoryPage.css"

// URL da API
const API_URL = 'http://localhost:3000/api'

function CategoryPage() {
  const { slug } = useParams()
  const [categoryAds, setCategoryAds] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [sortBy, setSortBy] = useState("recent")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mapeamento de slugs para nomes e ícones
  const categoriesMap = {
    vendas: { name: "Vendas", icon: "🛒" },
    servicos: { name: "Serviços", icon: "🔧" },
    imoveis: { name: "Imóveis", icon: "🏠" },
    empregos: { name: "Empregos", icon: "💼" },
    veiculos: { name: "Veículos", icon: "🚗" },
    eletronicos: { name: "Eletrônicos", icon: "📱" }
  }

  useEffect(() => {
    const fetchCategoryAds = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log(`🔍 Buscando anúncios da categoria: ${slug}`)
        
        // Buscar todos os anúncios e filtrar pela categoria no frontend
        // (já que a API pode não suportar filtro por categoria)
        const response = await fetch(`${API_URL}/ads`)
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        
        const allAds = await response.json()
        console.log(`📦 Total de anúncios recebidos: ${allAds.length}`)
        
        // Filtrar pela categoria
        const filteredAds = allAds.filter(ad => 
          ad.categoria?.toLowerCase() === slug.toLowerCase()
        )
        
        console.log(`🎯 Anúncios filtrados (${slug}): ${filteredAds.length}`)
        
        // Informações da categoria
        setCategoryInfo(categoriesMap[slug] || { 
          name: slug.charAt(0).toUpperCase() + slug.slice(1), 
          icon: "📂" 
        })
        
        // Aplicar ordenação
        let sortedAds = [...filteredAds]
        if (sortBy === "recent") {
          sortedAds = sortedAds.sort((a, b) => 
            new Date(b.criado_em || 0) - new Date(a.criado_em || 0)
          )
        } else if (sortBy === "priceAsc") {
          sortedAds = sortedAds.sort((a, b) => (a.preco || 0) - (b.preco || 0))
        } else if (sortBy === "priceDesc") {
          sortedAds = sortedAds.sort((a, b) => (b.preco || 0) - (a.preco || 0))
        }

        setCategoryAds(sortedAds)
        
      } catch (error) {
        console.error('❌ Erro ao buscar anúncios:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategoryAds()
    }
  }, [slug, sortBy])

  // Função para processar imagem
  const getImagemUrl = (ad) => {
    if (ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
      return `http://localhost:3000/uploads/${ad.imagens[0]}`
    }
    return null
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="error-state">
            <h2>❌ Erro ao carregar</h2>
            <p>{error}</p>
            <Link to="/" className="btn-primary">Voltar para Home</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!categoryInfo && !loading) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="no-ads">
            <h2>Categoria não encontrada</h2>
            <p>A categoria "{slug}" não existe.</p>
            <Link to="/" className="btn-primary">Voltar para Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <span>{categoryInfo?.name || slug}</span>
        </div>

        {/* Cabeçalho da categoria */}
        <div className="category-header">
          <div className="category-title">
            <span className="category-icon">{categoryInfo?.icon || "📂"}</span>
            <h1>{categoryInfo?.name || slug}</h1>
            <span className="category-count">
              {categoryAds.length} {categoryAds.length === 1 ? 'anúncio' : 'anúncios'}
            </span>
          </div>

          {categoryAds.length > 0 && (
            <div className="category-filters">
              <label htmlFor="sort">Ordenar por:</label>
              <select 
                id="sort"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                disabled={loading}
              >
                <option value="recent">Mais recentes</option>
                <option value="priceAsc">Menor preço</option>
                <option value="priceDesc">Maior preço</option>
              </select>
            </div>
          )}
        </div>

        {/* Lista de anúncios */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando anúncios...</p>
          </div>
        ) : (
          <>
            {categoryAds.length === 0 ? (
              <div className="no-ads">
                <span className="no-ads-icon">📭</span>
                <h3>Nenhum anúncio encontrado</h3>
                <p>Não há anúncios na categoria {categoryInfo?.name || slug}.</p>
                <Link to="/anunciar" className="btn-primary">
                  Seja o primeiro a anunciar!
                </Link>
              </div>
            ) : (
              <>
                <p className="results-info">
                  Mostrando {categoryAds.length} {categoryAds.length === 1 ? 'anúncio' : 'anúncios'}
                </p>
                <div className="ads-grid">
                  {categoryAds.map(ad => (
                    <AdCard 
                      key={ad.id} 
                      ad={ad}
                      imagemUrl={getImagemUrl(ad)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CategoryPage