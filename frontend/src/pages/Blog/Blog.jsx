// src/pages/blog/Blog.jsx
import { Link } from "react-router-dom"
import "./Blog.css"

const posts = [
  {
    id: 1,
    title: "10 Dicas para Vender Mais Rápido",
    excerpt: "Aprenda técnicas para atrair compradores e vender seus produtos em menos tempo.",
    category: "Dicas",
    date: "2024-02-14",
    image: "https://placehold.co/600x400/f72585/white?text=Dicas"
  },
  {
    id: 2,
    title: "Cuidados ao Comprar Usado",
    excerpt: "Saiba como evitar golpes e fazer negócios seguros.",
    category: "Segurança",
    date: "2024-02-10",
    image: "https://placehold.co/600x400/4361ee/white?text=Segurança"
  }
]

function Blog() {
  return (
    <div className="blog-page">
      <div className="container">
        <h1>Blog Itagi Classificados</h1>
        <p>Dicas e informações para comprar e vender melhor</p>

        <div className="blog-grid">
          {posts.map(post => (
            <article key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} />
              <div className="blog-card-content">
                <span className="blog-category">{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.id}`}>Ler mais →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog