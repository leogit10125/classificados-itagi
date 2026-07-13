// src/pages/CategoryPage/CategoryPage.jsx

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import AdCard from "../../components/ads/AdCard/AdCard"; //  Caminho atualizado com /ads/
import "./CategoryPage.css"

const API_URL = "http://localhost:3000/api"

function CategoryPage() {

  const { slug } = useParams()

  const [categoryAds, setCategoryAds] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [sortBy, setSortBy] = useState("recent")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const categoriesMap = {

    vendas: {
      name: "Vendas",
      icon: "🛒"
    },

    servicos: {
      name: "Serviços",
      icon: "🔧"
    },

    imoveis: {
      name: "Imóveis",
      icon: "🏠"
    },

    empregos: {
      name: "Empregos",
      icon: "💼"
    },

    veiculos: {
      name: "Veículos",
      icon: "🚗"
    },

    eletronicos: {
      name: "Eletrônicos",
      icon: "📱"
    }

  }


  useEffect(() => {

    const fetchCategoryAds = async () => {

      setLoading(true)
      setError(null)

      try {

        console.log(
          `🔍 Buscando anúncios da categoria: ${slug}`
        )


        const response = await fetch(
          `${API_URL}/categorias/${slug}`
        )


        if (!response.ok) {

          throw new Error(
            `Erro HTTP: ${response.status}`
          )

        }


        const ads = await response.json()


        console.log(
          `📦 Anúncios recebidos: ${ads.length}`
        )


        setCategoryInfo(
          categoriesMap[slug] || {
            name:
              slug.charAt(0).toUpperCase() +
              slug.slice(1),

            icon: "📂"
          }
        )


        let sortedAds = [...ads]


        if (sortBy === "recent") {

          sortedAds.sort((a, b) =>
            new Date(b.criado_em || 0) -
            new Date(a.criado_em || 0)
          )

        }


        if (sortBy === "priceAsc") {

          sortedAds.sort((a, b) =>
            Number(a.preco || 0) -
            Number(b.preco || 0)
          )

        }


        if (sortBy === "priceDesc") {

          sortedAds.sort((a, b) =>
            Number(b.preco || 0) -
            Number(a.preco || 0)
          )

        }


        setCategoryAds(sortedAds)


      } catch (err) {

        console.error(
          "❌ Erro ao buscar anúncios:",
          err
        )

        setError(err.message)


      } finally {

        setLoading(false)

      }

    }


    if (slug) {

      fetchCategoryAds()

    }


  }, [slug, sortBy])


  // Processar imagens dos anúncios

  const getImagemUrl = (ad) => {

    if (
      ad.imagens &&
      Array.isArray(ad.imagens) &&
      ad.imagens.length > 0
    ) {

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

            <Link 
              to="/" 
              className="btn-primary"
            >
              Voltar para Home
            </Link>

          </div>

        </div>

      </div>

    )

  }



  return (

    <div className="category-page">

      <div className="container">


        <div className="breadcrumb">

          <Link to="/">
            Home
          </Link>

          {" > "}

          <span>
            {categoryInfo?.name || slug}
          </span>

        </div>



        <div className="category-header">


          <div className="category-title">


            <span className="category-icon">

              {categoryInfo?.icon || "📂"}

            </span>


            <h1>

              {categoryInfo?.name || slug}

            </h1>


            <span className="category-count">

              {categoryAds.length}{" "}

              {
                categoryAds.length === 1
                ? "anúncio"
                : "anúncios"
              }

            </span>


          </div>



          {
            categoryAds.length > 0 && (

              <div className="category-filters">

                <label htmlFor="sort">

                  Ordenar por:

                </label>


                <select

                  id="sort"

                  value={sortBy}

                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }

                >

                  <option value="recent">
                    Mais recentes
                  </option>


                  <option value="priceAsc">
                    Menor preço
                  </option>


                  <option value="priceDesc">
                    Maior preço
                  </option>


                </select>


              </div>

            )
          }


        </div>



        {
          loading ? (

            <div className="loading">

              <div className="spinner"></div>

              <p>
                Carregando anúncios...
              </p>

            </div>


          ) : categoryAds.length === 0 ? (


            <div className="no-ads">

              <span className="no-ads-icon">
                📭
              </span>


              <h3>
                Nenhum anúncio encontrado
              </h3>


              <p>

                Não há anúncios na categoria{" "}
                {categoryInfo?.name || slug}.

              </p>


              <Link
                to="/anunciar"
                className="btn-primary"
              >

                Seja o primeiro a anunciar!

              </Link>


            </div>


          ) : (


            <>


              <p className="results-info">

                Mostrando {categoryAds.length}{" "}

                {
                  categoryAds.length === 1
                  ? "anúncio"
                  : "anúncios"
                }

              </p>



              <div className="ads-grid">

                {
                  categoryAds.map(ad => (

                    <AdCard

                      key={ad.id}

                      ad={ad}

                      imagemUrl={
                        getImagemUrl(ad)
                      }

                    />

                  ))
                }

              </div>


            </>


          )
        }


      </div>

    </div>

  )

}


export default CategoryPage