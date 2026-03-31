// src/components/AdCard/AdCard.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./AdCard.css"

// URL base da API para imagens
const API_URL = 'http://localhost:5000'

function AdCard({ 
  id,
  titulo,           // ← API retorna 'titulo' (não 'title')
  title,            // ← Mantido para compatibilidade
  preco,            // ← API retorna 'preco' (não 'price')
  price,
  priceFormatted,
  imagens,          // ← Nome antigo (plural)
  images,           // ← Nome novo da API (com 's')
  image,            // ← Imagem direta
  localizacao,      // ← API retorna 'localizacao' (não 'location')
  location = "Itagi",
  destaque,         // ← API retorna 'destaque' (0 ou 1)
  featured = false,
  views = 0,
  categoria,        // ← API retorna 'categoria'
  category,
  onClick
}) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  // LOG PARA DEBUG (remova depois)
  console.log('📦 AdCard recebeu:', { 
    id, 
    titulo, 
    images, 
    imagens, 
    image,
    type: { images: typeof images, imagens: typeof imagens }
  })

  // Determinar o título correto (prioriza titulo da API, depois title)
  const displayTitle = titulo || title || "Sem título"
  
  // Determinar o preço correto (prioriza preco da API, depois price)
  const displayPrice = preco || price || 0
  
  // Formatar preço se não vier formatado
  const formattedPrice = priceFormatted || 
    `R$ ${Number(displayPrice).toFixed(2).replace('.', ',')}`
  
  // Determinar localização
  const displayLocation = localizacao || location
  
  // Verificar se é destaque (pode vir como 0/1 ou true/false)
  const isFeatured = destaque === 1 || destaque === true || featured

  // Processar imagens quando o componente montar ou quando as props mudarem
  useEffect(() => {
    console.log('🔄 Processando imagens...')
    
    // 1. Se recebeu 'images' da API (nome correto)
    if (images && images.length > 0) {
      console.log('✅ Usando images (novo formato):', images)
      try {
        if (images[0].path) {
          setImageUrl(`${API_URL}${images[0].path}`)
          setImageError(false)
          return
        }
      } catch (e) {
        console.error('Erro ao processar images:', e)
      }
    }
    
    // 2. Se recebeu 'imagens' (nome antigo)
    if (imagens && imagens.length > 0) {
      console.log('✅ Usando imagens (formato antigo):', imagens)
      try {
        if (typeof imagens === 'object' && imagens[0]?.path) {
          setImageUrl(`${API_URL}${imagens[0].path}`)
          setImageError(false)
          return
        } else if (typeof imagens === 'string') {
          const parsed = JSON.parse(imagens)
          if (parsed[0]?.path) {
            setImageUrl(`${API_URL}${parsed[0].path}`)
            setImageError(false)
            return
          }
        }
      } catch (e) {
        console.error('Erro ao processar imagens:', e)
      }
    }
    
    // 3. Se recebeu 'image' direta
    if (image && !imageError) {
      console.log('✅ Usando image direta:', image)
      setImageUrl(image)
      setImageError(false)
      return
    }
    
    // 4. Se não tem imagem, usa placeholder
    console.log('ℹ️ Sem imagem, usando placeholder')
    setImageUrl(null)
    
  }, [images, imagens, image])

  const handleImageError = () => {
    console.log('❌ Erro ao carregar imagem:', imageUrl)
    setImageError(true)
    setImageUrl(null)
  }

  const handleClick = () => {
    if (onClick) {
      onClick(id)
    } else {
      navigate(`/anuncio/${id}`)
    }
  }

  // URL final da imagem
  const finalImageUrl = imageUrl || (imageError 
    ? "https://placehold.co/600x400/cccccc/white?text=Imagem+Indisponível"
    : "https://placehold.co/600x400/cccccc/white?text=Sem+Imagem")

  return (
    <div 
      className={`ad-card ${isFeatured ? 'featured' : ''}`} 
      onClick={handleClick}
    >
      <div className="ad-card-image-container">
        <img 
          src={finalImageUrl}
          alt={displayTitle}
          onError={handleImageError}
          loading="lazy"
        />
        {isFeatured && (
          <span className="ad-card-badge">🌟 Destaque</span>
        )}
      </div>

      <div className="ad-card-content">
        <h3 className="ad-card-title">{displayTitle}</h3>
        
        <div className="ad-card-price-container">
          <span className="ad-card-price">{formattedPrice}</span>
          {views > 0 && (
            <span className="ad-card-views">👁️ {views}</span>
          )}
        </div>

        <div className="ad-card-footer">
          <span className="ad-card-location">📍 {displayLocation}</span>
        </div>
      </div>
    </div>
  )
}

export default AdCard