// src/pages/CategoryPage.jsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import AdCard from "../components/AdCard/AdCard"
import "./CategoryPage.css"

// URL da API (igual ao Home.jsx)
const API_URL = 'http://localhost:5000/api'

function CategoryPage() {
  const { slug } = useParams()
  const [categoryAds, setCategoryAds] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [sortBy, setSortBy] = useState("recent")
  const [loading, setLoading] = useState(true)

  // Mapeamento de slugs para nomes e ícones (já que não temos tabela de categorias no backend)
  const categoriesMap = {
    vendas: { name: "Vendas", icon: "🏷️" },
    servicos: { name: "Serviços", icon: "🔧" },
    imoveis: { name: "Imóveis", icon: "🏠" },
    empregos: { name: "Empregos", icon: "💼" },
    veiculos: { name: "Veículos", icon: "🚗" },
    eletronicos: { name: "Eletrônicos", icon: "📱" }
  }

  useEffect(() => {
    const fetchCategoryAds = async () => {
      setLoading(true)
      
      try {
        // Buscar anúncios da categoria da API
        const response = await fetch(`${API_URL}/ads?category=${slug}`)
        const data = await response.json()
        
        // Informações da categoria
        setCategoryInfo(categoriesMap[slug] || { name: slug, icon: "📂" })
        
        // Ordenação local (já que a API pode não suportar sort)
        let sortedAds = [...data]
        if (sortBy === "recent") {
          sortedAds = sortedAds.sort((a, b) => 
            new Date(b.criado_em) - new Date(a.criado_em)
          )
        } else if (sortBy === "priceAsc") {
          sortedAds = sortedAds.sort((a, b) => a.preco - b.preco)
        } else if (sortBy === "priceDesc") {
          sortedAds = sortedAds.sort((a, b) => b.preco - a.preco)
        }

        setCategoryAds(sortedAds)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar anúncios da categoria:', error)
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategoryAds()
    }
  }, [slug, sortBy])

  if (!categoryInfo && !loading) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="no-ads">
            <p>Categoria não encontrada.</p>
            <Link to="/" className="btn-primary">Voltar para Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <div className="container">
        {/* Cabeçalho da categoria */}
        <div className="category-header">
          <div className="category-title">
            <span className="category-icon">{categoryInfo?.icon || "📂"}</span>
            <h1>{categoryInfo?.name || slug}</h1>
            <span className="category-count">
              {categoryAds.length} {categoryAds.length === 1 ? 'anúncio' : 'anúncios'}
            </span>
          </div>

          <div className="category-filters">
            <label>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              disabled={loading}
            >
              <option value="recent">Mais recentes</option>
              <option value="priceAsc">Menor preço</option>
              <option value="priceDesc">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <span>{categoryInfo?.name || slug}</span>
        </div>

        {/* Lista de anúncios */}
        {loading ? (
          <div className="loading">Carregando anúncios...</div>
        ) : (
          <>
            {categoryAds.length === 0 ? (
              <div className="no-ads">
                <p>Nenhum anúncio encontrado nesta categoria.</p>
                <Link to="/anunciar" className="btn-primary">
                  Seja o primeiro a anunciar!
                </Link>
              </div>
            ) : (
              <div className="ads-grid">
                {categoryAds.map(ad => (
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

export default CategoryPage