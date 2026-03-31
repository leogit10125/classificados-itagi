// src/components/AdsCarousel/AdsCarousel.jsx
import { useRef, useEffect, useState, useCallback } from "react"
import "./AdsCarousel.css"

function AdsCarousel({ ads = [] }) {
  const carrosselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollParaIndex = useCallback((index) => {
    const carrossel = carrosselRef.current
    if (!carrossel || !carrossel.children[index]) return

    carrossel.children[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
    setActiveIndex(index)
  }, [])

  const proximo = useCallback(() => {
    const nextIndex = (activeIndex + 1) % ads.length
    scrollParaIndex(nextIndex)
  }, [activeIndex, ads.length, scrollParaIndex])

  const anterior = useCallback(() => {
    const prevIndex = (activeIndex - 1 + ads.length) % ads.length
    scrollParaIndex(prevIndex)
  }, [activeIndex, ads.length, scrollParaIndex])

  useEffect(() => {
    if (ads.length === 0) return

    const interval = setInterval(() => {
      proximo()
    }, 4000)

    return () => clearInterval(interval)
  }, [proximo, ads.length])

  if (ads.length === 0) {
    return (
      <section className="carrossel-super-container">
        <div className="carrossel-wrapper">
          <h2 className="carrossel-titulo">🔥 Destaques da semana</h2>
          <p className="carrossel-subtitulo">Nenhum anúncio em destaque no momento</p>
        </div>
      </section>
    )
  }

  return (
    <section className="carrossel-super-container">
      <div className="carrossel-wrapper">
        <h2 className="carrossel-titulo">🔥 Destaques da semana</h2>
        <p className="carrossel-subtitulo">Os melhores anúncios escolhidos para você</p>

        <div className="carrossel-track" ref={carrosselRef}>
          {ads.map((ad, index) => (
            <div key={ad.id} className="carrossel-card">
              <div className="carrossel-card-imagem">
                {ad.destaque && <span className="carrossel-card-badge">Destaque</span>}
                <img 
                  src={ad.images?.[0] || 'https://via.placeholder.com/600x400/4158D0/ffffff?text=Itagi'} 
                  alt={ad.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400/4158D0/ffffff?text=Itagi'
                  }}
                />
              </div>
              <div className="carrossel-card-conteudo">
                <h3 className="carrossel-card-titulo">{ad.title || 'Produto Itagi'}</h3>
                <div className="carrossel-card-preco">
                  R$ {ad.price?.toFixed(2) || '390,00'}
                </div>
                <div className="carrossel-card-local">
                  {ad.city || ad.location || 'Itagi, BA'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carrossel-dots">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`carrossel-dot ${index === activeIndex ? 'ativo' : ''}`}
              onClick={() => scrollParaIndex(index)}
              aria-label={`Ir para anúncio ${index + 1}`}
            />
          ))}
        </div>

        <button className="carrossel-btn carrossel-btn-esquerda" onClick={anterior}>
          ←
        </button>
        <button className="carrossel-btn carrossel-btn-direita" onClick={proximo}>
          →
        </button>
      </div>
    </section>
  )
}

export default AdsCarousel