// src/components/Categories/Categories.jsx
import { Link } from "react-router-dom"
import "./Categories.css"

const categories = [
  { name: "Vendas", icon: "🏷️", slug: "vendas" },
  { name: "Serviços", icon: "🔧", slug: "servicos" },
  { name: "Imóveis", icon: "🏠", slug: "imoveis" },
  { name: "Empregos", icon: "💼", slug: "empregos" },
  { name: "Veículos", icon: "🚗", slug: "veiculos" },
  { name: "Eletrônicos", icon: "📱", slug: "eletronicos" }
]

function Categories() {
  return (
    <section className="categories">
      <div className="container">
        <h2>Explore por categoria</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/categoria/${cat.slug}`} 
              className="category-card"
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories