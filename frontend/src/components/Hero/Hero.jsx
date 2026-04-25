// src/components/Hero/Hero.jsx
import { useState, useEffect } from "react"; // 👈 Adiciona useEffect
import { useNavigate } from "react-router-dom";
import { getStats } from "../../services/statsService"; // 👈 Importa o serviço
import "./Hero.css";

function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    anuncios: 0,
    usuarios: 0,
    categorias: 0
  }); // 👈 Estado para os stats
  const navigate = useNavigate();

  // 👇 BUSCA OS NÚMEROS REAIS DO BANCO!
  useEffect(() => {
    const carregarStats = async () => {
      const dados = await getStats();
      setStats(dados);
      console.log('📊 Stats reais:', dados); // Vê no console
    };
    carregarStats();
  }, []); // Array vazio = executa só uma vez quando carrega

  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log('🔍 Navegando para buscar:', searchTerm);
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
    } else {
      alert('Digite algo para buscar!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 👇 Função para formatar números (ex: 1234 -> 1.2k+)
  const formatarNumero = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k+';
    }
    return num + '+';
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-main">Itagi</span>
          <span className="hero-title-sub">Classificados</span>
        </h1>
        
        <p className="hero-description">
          Compre, venda e anuncie em Itagi e região
        </p>
        
        <div className="hero-search">
          <input
            type="text"
            placeholder="Digite sua busca aqui"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="hero-search-input"
          />
          <button 
            className="hero-search-button"
            onClick={handleSearch}
          >
            <span>Buscar</span>
            <svg>...ícone de busca...</svg>
          </button>
        </div>
        
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">
              {formatarNumero(stats.anuncios)}
            </span>
            <span className="hero-stat-label">ANÚNCIOS</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">
              {formatarNumero(stats.usuarios)}
            </span>
            <span className="hero-stat-label">USUÁRIOS</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">
              {formatarNumero(stats.categorias)}
            </span>
            <span className="hero-stat-label">CATEGORIAS</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;