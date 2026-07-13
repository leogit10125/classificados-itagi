import { useState, useEffect } from "react";
import "./AdsCarousel.css";

// Placeholder fora do componente para não recriar a cada render
const PLACEHOLDER_IMG = 'https://via.placeholder.com/600x400?text=Imagem+Indisponível';

function AdsCarousel({ ads = [] }) {
  const [index, setIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Avança automaticamente com segurança
  useEffect(() => {
    // Se não houver anúncios ou apenas 1, não precisa de carrossel rodando
    if (!ads || ads.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ads.length);
    }, 4000);

    // Limpeza fundamental para não travar a memória ou o timer
    return () => clearInterval(timer);
  }, [ads.length]); // Monitora apenas o tamanho da lista

  // Resetar erros de imagem quando mudar de índice
  useEffect(() => {
    setImageErrors(prev => ({ ...prev, [index]: false }));
  }, [index]);

  // Se não tem anúncios
  if (!ads || ads.length === 0) {
    return (
      <div className="carousel-empty">
        <p>📭 Nenhum anúncio disponível no momento.</p>
      </div>
    );
  }

  // Garantir que o índice está dentro dos limites
  const safeIndex = Math.min(index, ads.length - 1);
  const ad = ads[safeIndex];

  // Função melhorada para evitar erros de leitura de imagem
  const getImagemUrl = () => {
    // Verifica se há erro de carregamento para esta imagem
    if (imageErrors[safeIndex]) {
      return PLACEHOLDER_IMG;
    }

    // Verifica se o anúncio e as imagens existem
    if (ad && ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
      const foto = ad.imagens[0];
      if (foto && typeof foto === 'string') {
        // Se já for uma URL completa (http...), usa direto, senão monta o link do backend
        return foto.startsWith('http') ? foto : `http://localhost:3000/uploads/${foto}`;
      }
    }
    return PLACEHOLDER_IMG;
  };

  const formatarPreco = (preco) => {
    const valor = parseFloat(preco);
    return isNaN(valor) ? '0,00' : valor.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  // Handlers com validação
  const handlePrev = () => {
    setIndex((current) => (current - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setIndex((current) => (current + 1) % ads.length);
  };

  const handleImageError = () => {
    setImageErrors(prev => ({ ...prev, [safeIndex]: true }));
  };

  return (
    <div className="carousel-container">
      <div className="carousel-card">
        <div className="image-wrapper">
          <img
            src={getImagemUrl()}
            alt={ad?.titulo || 'Anúncio'}
            key={safeIndex} // Ajuda o React a saber que a imagem mudou para animar
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        <div className="carousel-info">
          <h3>{ad?.titulo || 'Sem título'}</h3>
          <p className="preco">R$ {formatarPreco(ad?.preco)}</p>
          <p className="local">📍 {ad?.localizacao || 'Itagi'}</p>
        </div>
      </div>

      {/* Setas Manuais - só mostra se tiver mais de 1 anúncio */}
      {ads.length > 1 && (
        <>
          <button
            className="seta seta-esquerda"
            onClick={handlePrev}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            className="seta seta-direita"
            onClick={handleNext}
            aria-label="Próximo"
          >
            ›
          </button>
        </>
      )}

      {/* Indicadores (Bolinhas) - só mostra se tiver mais de 1 anúncio */}
      {ads.length > 1 && (
        <div className="dots">
          {ads.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === safeIndex ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Ir para anúncio ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdsCarousel;