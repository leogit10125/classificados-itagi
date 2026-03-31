import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategorias } from '../../services/categoriaService';
import './Categories.css';

function Categories() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Categories montado, carregando dados...');
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    console.log('📥 Chamando getCategorias()...');
    setLoading(true);
    const dados = await getCategorias();
    console.log('📦 Dados recebidos em Categories:', dados);
    setCategorias(dados);
    setLoading(false);
  };

  // Ícones para cada categoria (opcional)
  const getIcon = (categoria) => {
    const icons = {
      'Vendas': '🛒',
      'Serviços': '🔧',
      'Imóveis': '🏠',
      'Empregos': '💼',
      'Veículos': '🚗',
      'Eletrônicos': '📱',
      'Eletrodomésticos': '🧊',
      'Informática': '💻',
      'Moda': '👕',
      'Esportes': '⚽',
      'Outros': '📦'
    };
    return icons[categoria.nome] || '📌';
  };

  console.log('🔄 Renderizando Categories, loading:', loading, 'categorias:', categorias);

  if (loading) {
    return <div className="categories-loading">Carregando categorias...</div>;
  }

  return (
    <section className="categories-section">
      <h2 className="categories-title">EXPLORE POR CATEGORIA</h2>
      <div className="categories-grid">
        {categorias.map((categoria) => (
          <Link 
            key={categoria.slug} 
            to={`/categoria/${categoria.slug}`}
            className="category-card"
          >
            <span className="category-icon">{getIcon(categoria)}</span>
            <span className="category-name">{categoria.nome}</span>
            <span className="category-count">
              {categoria.total} {categoria.total === 1 ? 'anúncio' : 'anúncios'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;