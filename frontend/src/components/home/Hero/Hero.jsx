// src/components/home/Hero/Hero.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStats } from "../../../services/statsService";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");

  const [stats, setStats] = useState({
    anuncios: 0,
    usuarios: 0,
    categorias: 0,
  });

  useEffect(() => {
    async function carregarStats() {
      try {
        const dados = await getStats();
        setStats(dados);
        console.log("📊 Stats:", dados);
      } catch (erro) {
        console.error("Erro ao carregar estatísticas:", erro);
      }
    }

    carregarStats();
  }, []);

  function pesquisar() {
    const termo = busca.trim();

    if (!termo) return;

    navigate(`/buscar?q=${encodeURIComponent(termo)}`);
  }

  function formatarNumero(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k+";
    }

    return `${num}+`;
  }

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-main">Itagi</span>
          <span className="hero-title-sub">Classificados</span>
        </h1>

        <p className="hero-description">
          Compre, venda e anuncie em Itagi e toda a região.
        </p>

        <div className="hero-search">
          <input
            type="text"
            className="hero-search-input"
            placeholder="O que você procura?"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                pesquisar();
              }
            }}
          />

          <button
            className="hero-search-button"
            onClick={pesquisar}
          >
            🔍 Buscar
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">
              {formatarNumero(stats.anuncios)}
            </span>
            <span className="hero-stat-label">
              Anúncios
            </span>
          </div>

          <div className="hero-stat">
            <span className="hero-stat-number">
              {formatarNumero(stats.usuarios)}
            </span>
            <span className="hero-stat-label">
              Usuários
            </span>
          </div>

          <div className="hero-stat">
            <span className="hero-stat-number">
              {formatarNumero(stats.categorias)}
            </span>
            <span className="hero-stat-label">
              Categorias
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;