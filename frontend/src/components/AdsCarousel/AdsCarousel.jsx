import { useState, useEffect, useRef } from "react";
import "./AdsCarousel.css";

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/600x400?text=Imagem+Indisponível";

function AdsCarousel({ ads = [] }) {
  const [index, setIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [animating, setAnimating] = useState(false);

  const startX = useRef(0);
  const endX = useRef(0);

  // 🔁 autoplay seguro
  useEffect(() => {
    if (!ads || ads.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ads.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [ads.length]);

  // 🧠 reset erro imagem ao trocar
  useEffect(() => {
    setImageErrors((prev) => ({ ...prev, [index]: false }));
  }, [index]);

  // ⚡ preload imagens
  useEffect(() => {
    if (!ads?.length) return;

    ads.forEach((ad) => {
      const img = ad?.imagens?.[0];
      if (img) {
        const pre = new Image();
        pre.src = img.startsWith("http")
          ? img
          : `http://localhost:3000/uploads/${img}`;
      }
    });
  }, [ads]);

  if (!ads || ads.length === 0) {
    return (
      <div className="carousel-empty">
        <p>📭 Nenhum anúncio disponível no momento.</p>
      </div>
    );
  }

  const safeIndex = Math.min(index, ads.length - 1);
  const ad = ads[safeIndex];

  // 🖼 imagem limpa
  const getImagemUrl = () => {
    const img = ad?.imagens?.[0];

    if (imageErrors[safeIndex]) return PLACEHOLDER_IMG;
    if (!img) return PLACEHOLDER_IMG;

    return img.startsWith("http")
      ? img
      : `http://localhost:3000/uploads/${img}`;
  };

  // 💰 preço formatado
  const formatarPreco = (preco) => {
    const valor = Number(preco);
    return isNaN(valor)
      ? "0,00"
      : valor.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        });
  };

  // ⬅️➡️ navegação com lock anti spam
  const handleNext = () => {
    if (animating) return;

    setAnimating(true);
    setIndex((current) => (current + 1) % ads.length);

    setTimeout(() => setAnimating(false), 350);
  };

  const handlePrev = () => {
    if (animating) return;

    setAnimating(true);
    setIndex((current) => (current - 1 + ads.length) % ads.length);

    setTimeout(() => setAnimating(false), 350);
  };

  // 📱 swipe mobile
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;

    const diff = startX.current - endX.current;

    if (Math.abs(diff) < 50) return;

    diff > 0 ? handleNext() : handlePrev();
  };

  const handleImageError = () => {
    setImageErrors((prev) => ({
      ...prev,
      [safeIndex]: true,
    }));
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* imagem */}
        <div className="image-wrapper">
          <img
            src={getImagemUrl()}
            alt={ad?.titulo || "Anúncio"}
            key={ad?.id || safeIndex}
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* info */}
        <div className="carousel-info">
          <h3>{ad?.titulo || "Sem título"}</h3>
          <p className="preco">R$ {formatarPreco(ad?.preco)}</p>
          <p className="local">📍 {ad?.localizacao || "Itagi"}</p>
        </div>
      </div>

      {/* setas */}
      {ads.length > 1 && (
        <>
          <button
            className="seta seta-esquerda"
            onClick={handlePrev}
            aria-label="Anterior"
          >
            ‹
          </button>

          //

          <button
            className="seta seta-direita"
            onClick={handleNext}
            aria-label="Próximo"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default AdsCarousel;