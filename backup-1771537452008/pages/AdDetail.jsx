// src/pages/AdDetail.jsx
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { mockAds } from "../data/mockAds"
import AdCard from "../components/AdCard/AdCard"
import "./AdDetail.css"

function AdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedAds, setRelatedAds] = useState([])
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    
    // Simulando chamada API
    setTimeout(() => {
      const foundAd = mockAds.find(ad => ad.id === parseInt(id))
      
      if (foundAd) {
        setAd(foundAd)
        
        // Buscar anúncios relacionados (mesma categoria)
        const related = mockAds
          .filter(ad => ad.category === foundAd.category && ad.id !== foundAd.id)
          .slice(0, 4)
        setRelatedAds(related)
      }
      
      setLoading(false)
    }, 500)
  }, [id])

  // Simular galeria de imagens (se tiver apenas uma, duplica)
  const images = ad?.images || [ad?.image || "https://via.placeholder.com/800x600?text=Sem+Imagem"]

  const handleContact = (type) => {
    if (type === 'whatsapp') {
      window.open(`https://wa.me/55${ad.user.phone.replace(/\D/g, '')}?text=Olá, vi seu anúncio de ${ad.title} no Itagi Classificados`, '_blank')
    } else if (type === 'phone') {
      window.location.href = `tel:${ad.user.phone}`
    }
  }

  if (loading) {
    return (
      <div className="ad-detail-loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Carregando anúncio...</p>
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="ad-detail-not-found">
        <div className="container">
          <h1>Anúncio não encontrado</h1>
          <p>O anúncio que você está procurando não existe ou foi removido.</p>
          <Link to="/" className="btn-primary">Voltar para página inicial</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="ad-detail-breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to={`/categoria/${ad.category}`}>{ad.categoryName}</Link> &gt; 
          <span>{ad.title}</span>
        </div>

        <div className="ad-detail-grid">
          {/* Coluna esquerda - Imagens */}
          <div className="ad-detail-gallery">
            <div className="ad-detail-main-image">
              <img 
                src={images[currentImage]} 
                alt={ad.title}
                onClick={() => window.open(images[currentImage], '_blank')}
              />
            </div>
            
            {images.length > 1 && (
              <div className="ad-detail-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <img src={img} alt={`${ad.title} - imagem ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div className="ad-detail-views">
              👁️ {ad.views} visualizações
            </div>
          </div>

          {/* Coluna direita - Informações */}
          <div className="ad-detail-info">
            <h1 className="ad-detail-title">{ad.title}</h1>
            
            <div className="ad-detail-price">
              {ad.priceFormatted}
            </div>

            <div className="ad-detail-meta">
              <span className="ad-detail-category">
                📁 {ad.categoryName}
              </span>
              <span className="ad-detail-location">
                📍 {ad.location}
              </span>
              <span className="ad-detail-date">
                🕒 {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="ad-detail-description">
              <h3>Descrição</h3>
              <p>{ad.description}</p>
            </div>

            {/* Card do vendedor */}
            <div className="ad-detail-seller">
              <h3>Vendedor</h3>
              <div className="seller-info">
                <div className="seller-avatar">
                  {ad.user.name.charAt(0)}
                </div>
                <div className="seller-details">
                  <strong>{ad.user.name}</strong>
                  <span>{ad.user.ads} anúncios ativos</span>
                </div>
              </div>

              <div className="seller-contact">
                <button 
                  className="btn-contact btn-whatsapp"
                  onClick={() => handleContact('whatsapp')}
                >
                  📱 WhatsApp
                </button>
                <button 
                  className="btn-contact btn-phone"
                  onClick={() => handleContact('phone')}
                >
                  📞 Ligar agora
                </button>
              </div>
            </div>

            {/* Compartilhar */}
            <div className="ad-detail-share">
              <h3>Compartilhar</h3>
              <div className="share-buttons">
                <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  🔗 Copiar link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Anúncios relacionados */}
        {relatedAds.length > 0 && (
          <section className="related-ads">
            <h2>Anúncios relacionados</h2>
            <div className="related-ads-grid">
              {relatedAds.map(relatedAd => (
                <AdCard key={relatedAd.id} {...relatedAd} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default AdDetail