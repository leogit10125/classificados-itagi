// src/pages/blog/Categoria.jsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./Blog.css"

// Mesmos dados do Post.jsx
const postsData = [
  {
    id: 1,
    title: "10 Dicas para Vender Mais Rápido no Itagi Classificados",
    excerpt: "Aprenda técnicas infalíveis para atrair compradores e vender seus produtos em menos tempo.",
    category: "Dicas",
    date: "2024-02-14",
    image: "https://placehold.co/600x400/f72585/white?text=Dicas+para+Vender",
    author: "Equipe Itagi",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Cuidados ao Comprar Usado: Guia Completo",
    excerpt: "Saiba como evitar golpes, verificar a procedência e fazer negócios seguros.",
    category: "Segurança",
    date: "2024-02-10",
    image: "https://placehold.co/600x400/4361ee/white?text=Cuidados+ao+Comprar",
    author: "Maria Santos",
    readTime: "8 min"
  },
  {
    id: 3,
    title: "Como Fotos de Qualidade Aumentam Suas Vendas",
    excerpt: "Descubra técnicas simples para fotografar seus produtos e destacar seus anúncios.",
    category: "Marketing",
    date: "2024-02-05",
    image: "https://placehold.co/600x400/4895ef/white?text=Fotos+de+Qualidade",
    author: "João Silva",
    readTime: "6 min"
  }
]

function Categoria() {
  const { categoria } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Capitalizar primeira letra da categoria
  const categoriaFormatada = categoria.charAt(0).toUpperCase() + categoria.slice(1)

  useEffect(() => {
    setLoading(true)
    
    setTimeout(() => {
      const filteredPosts = postsData.filter(
        post => post.category.toLowerCase() === categoria.toLowerCase()
      )
      setPosts(filteredPosts)
      setLoading(false)
    }, 300)
  }, [categoria])

  return (
    <div className="blog-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to="/blog">Blog</Link> &gt; 
          <span>Categoria: {categoriaFormatada}</span>
        </div>

        <div className="blog-header">
          <h1>Categoria: {categoriaFormatada}</h1>
          <p className="subtitle">
            {loading 
              ? "Carregando posts..." 
              : `${posts.length} posts encontrados`
            }
          </p>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>Nenhum post encontrado na categoria "{categoriaFormatada}".</p>
                <Link to="/blog" className="btn-primary">
                  Ver todos os posts
                </Link>
              </div>
            ) : (
              <div className="blog-grid">
                {posts.map(post => (
                  <article key={post.id} className="blog-card">
                    <Link to={`/blog/${post.id}`} className="blog-card-image">
                      <img src={post.image} alt={post.title} />
                      <span className="blog-category">{post.category}</span>
                    </Link>
                    
                    <div className="blog-card-content">
                      <div className="blog-meta">
                        <span className="blog-date">📅 {new Date(post.date).toLocaleDateString('pt-BR')}</span>
                        <span className="blog-read-time">⏱️ {post.readTime}</span>
                      </div>
                      
                      <h3>
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      
                      <p className="blog-excerpt">{post.excerpt}</p>
                      
                      <div className="blog-footer">
                        <span className="blog-author">✍️ Por {post.author}</span>
                        <Link to={`/blog/${post.id}`} className="read-more">
                          Ler mais →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Categoria