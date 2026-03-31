import { useState, useEffect } from "react"
import "./AdsCarousel.css"
import placeholderImg from '../../assets/placeholder.svg';

function AdsCarousel({ ads = [] }) {
  const [index, setIndex] = useState(0)

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

  if (!ads || ads.length === 0) {
    return <div className="carousel-empty">Nenhum anúncio disponível</div>
  }

  const ad = ads[index];

  // Função melhorada para evitar erros de leitura de imagem
  const getImagemUrl = () => {
    // Verifica se existe o array de imagens e se o primeiro item não é vazio
    if (ad && ad.imagens && Array.isArray(ad.imagens) && ad.imagens.length > 0) {
      const foto = ad.imagens[0];
      // Se já for uma URL completa (http...), usa direto, senão monta o link do seu backend
      return foto.startsWith('http') ? foto : `http://localhost:3000/uploads/${foto}`;
    }
    return placeholderImg;
  };

  const formatarPreco = (preco) => {
    const valor = parseFloat(preco);
    return isNaN(valor) ? '0.00' : valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <div className="carousel-container">
      <div className="carousel-card">
        <div className="image-wrapper">
          <img
            src={getImagemUrl()}
            alt={ad.titulo || 'Anúncio'}
            key={index} // Ajuda o React a saber que a imagem mudou para animar
            onError={(e) => {
              e.target.src = placeholderImg;
            }}
          />
        </div>

        <div className="carousel-info">
          <h3>{ad.titulo || 'Sem título'}</h3>
          <p className="preco">R$ {formatarPreco(ad.preco)}</p>
          <p className="local">📍 {ad.localizacao || 'Itagi'}</p>
        </div>
      </div>

      {/* Setas Manuais */}
      <button
        className="seta seta-esquerda"
        onClick={() => setIndex((index - 1 + ads.length) % ads.length)}
      >‹</button>
      <button
        className="seta seta-direita"
        onClick={() => setIndex((index + 1) % ads.length)}
      >›</button>

      {/* Indicadores (Bolinhas) */}
      <div className="dots">
        {ads.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default AdsCarousel