// src/pages/blog/Post.jsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "./Blog.css"

// Dados mockados dos posts (depois virão do banco)
const postsData = [
  {
    id: 1,
    title: "10 Dicas para Vender Mais Rápido no Itagi Classificados",
    content: `
      <p>Vender produtos online pode ser um desafio, mas com as estratégias certas, você pode acelerar suas vendas. Confira nossas dicas:</p>
      
      <h3>1. Fotos de qualidade</h3>
      <p>Tire fotos claras, bem iluminadas e de vários ângulos. Mostre detalhes e possíveis imperfeições para evitar surpresas.</p>
      
      <h3>2. Descrição detalhada</h3>
      <p>Descreva o produto com todas as características: marca, modelo, tamanho, cor, tempo de uso, estado de conservação.</p>
      
      <h3>3. Preço justo</h3>
      <p>Pesquise preços de produtos similares e coloque um valor competitivo. Lembre-se que produto usado tem desvalorização.</p>
      
      <h3>4. Responda rápido</h3>
      <p>Quanto mais rápido você responder às perguntas, maiores as chances de fechar negócio.</p>
      
      <h3>5. Destaque seu anúncio</h3>
      <p>Por apenas R$ 5, você pode destacar seu anúncio e aparecer no topo das buscas por 7 dias.</p>
    `,
    category: "Dicas",
    date: "2024-02-14",
    image: "https://placehold.co/1200x600/f72585/white?text=Dicas+para+Vender",
    author: "Equipe Itagi",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Cuidados ao Comprar Usado: Guia Completo",
    content: `
      <p>Comprar produtos usados pode ser uma ótima forma de economizar, mas é preciso tomar alguns cuidados. Veja nosso guia:</p>
      
      <h3>1. Desconfie de preços muito baixos</h3>
      <p>Se o preço está muito abaixo do mercado, pode ser golpe. Desconfie sempre.</p>
      
      <h3>2. Peça fotos reais</h3>
      <p>Se o anúncio usa fotos de catálogo, peça fotos reais do produto que será vendido.</p>
      
      <h3>3. Prefira encontrar em local público</h3>
      <p>Para produtos de valor, marque encontro em locais movimentados ou shoppings.</p>
      
      <h3>4. Teste o produto antes de pagar</h3>
      <p>Se for eletrônico, teste tudo: botões, tela, bateria, entradas.</p>
      
      <h3>5. Use o chat da plataforma</h3>
      <p>Mantenha a conversa dentro do site para ter registro em caso de problemas.</p>
    `,
    category: "Segurança",
    date: "2024-02-10",
    image: "https://placehold.co/1200x600/4361ee/white?text=Cuidados+ao+Comprar",
    author: "Maria Santos",
    readTime: "8 min"
  },
  {
    id: 3,
    title: "Como Fotos de Qualidade Aumentam Suas Vendas",
    content: `
      <p>Uma imagem vale mais que mil palavras, e nos classificados, vale mais que mil reais! Saiba como fotografar seus produtos:</p>
      
      <h3>Use luz natural</h3>
      <p>Fotografe perto de janelas durante o dia. Evite flash que pode distorcer cores.</p>
      
      <h3>Fundo neutro</h3>
      <p>Use um fundo branco ou liso para destacar o produto. Uma parede clara já resolve.</p>
      
      <h3>Múltiplos ângulos</h3>
      <p>Mostre frente, verso, laterais e detalhes importantes como marcas de uso.</p>
      
      <h3>Mostre o tamanho</h3>
      <p>Coloque um objeto de referência (como uma moeda) para dar noção de tamanho.</p>
      
      <h3>Edite com moderação</h3>
      <p>Ajuste brilho e contraste, mas não mude cores ou remova imperfeições.</p>
    `,
    category: "Marketing",
    date: "2024-02-05",
    image: "https://placehold.co/1200x600/4895ef/white?text=Fotos+de+Qualidade",
    author: "João Silva",
    readTime: "6 min"
  }
]

function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      const foundPost = postsData.find(p => p.id === parseInt(id))
      setPost(foundPost)
      setLoading(false)
    }, 300)
  }, [id])

  if (loading) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="loading">Carregando post...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-page">
        <div className="container">
          <div className="post-not-found">
            <h1>Post não encontrado</h1>
            <p>O post que você está procurando não existe.</p>
            <Link to="/blog" className="btn-primary">Voltar para o blog</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to="/blog">Blog</Link> &gt; 
          <span>{post.title}</span>
        </div>

        <article className="post-full">
          <header className="post-header">
            <h1>{post.title}</h1>
            
            <div className="post-meta">
              <span className="post-category">{post.category}</span>
              <span className="post-date">📅 {new Date(post.date).toLocaleDateString('pt-BR')}</span>
              <span className="post-author">✍️ Por {post.author}</span>
              <span className="post-read-time">⏱️ {post.readTime}</span>
            </div>
          </header>

          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>

          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="post-footer">
            <h3>Gostou do conteúdo?</h3>
            <p>Compartilhe com alguém que também vai gostar!</p>
            
            <div className="post-share">
              <button 
                className="share-btn"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                🔗 Copiar link
              </button>
            </div>

            <Link to="/blog" className="back-to-blog">
              ← Voltar para o blog
            </Link>
          </div>
        </article>

        {/* Posts relacionados */}
        <section className="related-posts">
          <h2>Posts relacionados</h2>
          <div className="blog-grid">
            {postsData
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 3)
              .map(relatedPost => (
                <article key={relatedPost.id} className="blog-card">
                  <Link to={`/blog/${relatedPost.id}`} className="blog-card-image">
                    <img src={relatedPost.image} alt={relatedPost.title} />
                    <span className="blog-category">{relatedPost.category}</span>
                  </Link>
                  <div className="blog-card-content">
                    <h3>
                      <Link to={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                    </h3>
                    <p>{relatedPost.excerpt}</p>
                    <Link to={`/blog/${relatedPost.id}`} className="read-more">
                      Ler mais →
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Post