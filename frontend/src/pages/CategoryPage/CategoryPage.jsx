// src/pages/CategoryPage/CategoryPage.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AdCard from "../../components/AdCard/AdCard";
import "./CategoryPage.css";

const API_URL = "http://localhost:3000/api";

const categorias = {
  vendas: { nome: "Vendas", icone: "🛒" },
  servicos: { nome: "Serviços", icone: "🔧" },
  imoveis: { nome: "Imóveis", icone: "🏠" },
  empregos: { nome: "Empregos", icone: "💼" },
  veiculos: { nome: "Veículos", icone: "🚗" },
  eletronicos: { nome: "Eletrônicos", icone: "📱" },
  eletrodomesticos: { nome: "Eletrodomésticos", icone: "🧊" },
  informatica: { nome: "Informática", icone: "💻" },
  moda: { nome: "Moda", icone: "👕" },
  esportes: { nome: "Esportes", icone: "⚽" },
  outros: { nome: "Outros", icone: "📦" }
};

function CategoryPage() {
  const { slug } = useParams();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [error, setError] = useState("");

  const categoria = categorias[slug];

  useEffect(() => {
    carregarCategoria();
  }, [slug]);

  async function carregarCategoria() {
    try {
      setLoading(true);

      console.log("📦 Categoria:", slug);

      const response = await fetch(`${API_URL}/categorias/${slug}`);

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const dados = await response.json();

      console.log("✅ Anúncios:", dados);

      setAds(dados);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const anunciosOrdenados = [...ads].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return Number(a.preco) - Number(b.preco);

      case "priceDesc":
        return Number(b.preco) - Number(a.preco);

      default:
        return new Date(b.criado_em) - new Date(a.criado_em);
    }
  });

  if (!categoria) {
    return (
      <div className="category-page">
        <div className="container">
          <h2>Categoria não encontrada</h2>

          <Link to="/">Voltar</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="category-page">
        <div className="container">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="container">
          <h2>Erro</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">

      <div className="container">

        <div className="breadcrumb">
          <Link to="/">Home</Link> / {categoria.nome}
        </div>

        <div className="category-header">

          <h1>
            {categoria.icone} {categoria.nome}
          </h1>

          <span>
            {ads.length} {ads.length === 1 ? "anúncio" : "anúncios"}
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Mais recentes</option>
            <option value="priceAsc">Menor preço</option>
            <option value="priceDesc">Maior preço</option>
          </select>

        </div>

        {anunciosOrdenados.length === 0 ? (
          <div className="no-ads">

            <h2>Nenhum anúncio encontrado.</h2>

            <Link to="/anunciar">
              Seja o primeiro a anunciar
            </Link>

          </div>
        ) : (
          <div className="ads-grid">
            {anunciosOrdenados.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default CategoryPage;