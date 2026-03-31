// src/pages/AdDetail/AdDetail.jsx
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "./AdDetail.css"

const API_URL = 'http://localhost:3000/api'

function AdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    fetchAdDetail()
  }, [id])

  const fetchAdDetail = async () => {
    try {
      setLoading(true)
      console.log(`🔍 Buscando anúncio ID: ${id}`)
      
      const response = await fetch(`${API_URL}/ads/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Anúncio não encontrado')
        }
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📦 Anúncio encontrado:', data)
      setAd(data)
      
    } catch (error) {
      console.error('❌ Erro:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    // Aqui você pode implementar contato via WhatsApp ou mensagem
    if (ad?.usuario_telefone) {
      window.open(`https://wa.me/55${ad.usuario_telefone}?text=Olá, tenho interesse no anúncio: ${ad.titulo}`, '_blank')
    }
  }

  const getImagemUrl = (img) => {
    if (!img) return null
    return `http://localhost:3000/uploads/${img}`
  }

  if (loading) {
    return (
      <div className="ad-detail loading">
        <div className="spinner"></div>
        <p>Carregando anúncio...</p>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="ad-detail error">
        <div className="container">
          <h2>❌ Anúncio não encontrado</h2>
          <p>O anúncio que você está procurando não existe ou foi removido.</p>
          <Link to="/" className="btn-primary">
            Voltar para página inicial
          </Link>
        </div>
      </div>
    )
  }

  const imagens = ad.imagens || []
  const whatsappNumber = ad.usuario_telefone || ad.telefone

  return (
    <div className="ad-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to={`/categoria/${ad.categoria}`}>{ad.categoria}</Link> &gt; 
          <span>{ad.titulo}</span>
        </div>

        <div className="ad-content">
          {/* Galeria de imagens */}
          <div className="ad-gallery">
            {imagens.length > 0 ? (
              <>
                <div className="main-image">
                  <img 
                    src={getImagemUrl(imagens[currentImage])} 
                    alt={ad.titulo}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x400?text=Imagem+Indisponível'
                    }}
                  />
                </div>
                
                {imagens.length > 1 && (
                  <div className="thumbnails">
                    {imagens.map((img, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                        onClick={() => setCurrentImage(index)}
                      >
                        <img 
                          src={getImagemUrl(img)} 
                          alt={`Miniatura ${index + 1}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">
                <img src="https://via.placeholder.com/600x400?text=Sem+Imagem" alt="Sem imagem" />
              </div>
            )}
          </div>

          {/* Informações do anúncio */}
          <div className="ad-info">
            <h1>{ad.titulo}</h1>
            
            <div className="ad-price">
              <strong>Preço:</strong>
              <span>R$ {typeof ad.preco === 'number' ? ad.preco.toFixed(2) : ad.preco}</span>
            </div>

            <div className="ad-meta">
              <div className="meta-item">
                <span className="meta-label">Categoria:</span>
                <span className="meta-value">{ad.categoria}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Localização:</span>
                <span className="meta-value">📍 {ad.localizacao || 'Itagi'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Anunciante:</span>
                <span className="meta-value">{ad.usuario_nome || 'Usuário'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Publicado em:</span>
                <span className="meta-value">
                  {new Date(ad.criado_em).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Visualizações:</span>
                <span className="meta-value">👁️ {ad.views || 0}</span>
              </div>
            </div>

            <div className="ad-description">
              <h3>Descrição</h3>
              <p>{ad.descricao || 'Sem descrição'}</p>
            </div>

            {/* Botões de ação */}
            <div className="ad-actions">
              {whatsappNumber && (
                <button onClick={handleContact} className="btn-whatsapp">
                  📱 Conversar com anunciante
                </button>
              )}
              <button 
                onClick={() => navigate(-1)} 
                className="btn-secondary"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdDetail