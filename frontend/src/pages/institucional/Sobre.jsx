// src/pages/institucional/Sobre.jsx
import { Link } from "react-router-dom"
import "./Institucional.css"

function Sobre() {
  return (
    <div className="institucional-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Quem Somos</span>
        </div>

        <div className="institucional-header">
          <h1>Quem Somos</h1>
          <p className="subtitle">Conheça a história do Itagi Classificados</p>
        </div>

        <div className="institucional-content">
          <section>
            <h2>Nossa História</h2>
            <p>
              O <strong>Itagi Classificados</strong> nasceu com um objetivo simples: 
              conectar pessoas da nossa cidade e região para comprar, vender e anunciar produtos e serviços 
              de forma fácil, segura e gratuita.
            </p>
            <p>
              Percebemos que em Itagi e povoados vizinhos faltava um ponto de encontro digital feito sob medida 
              para atender às necessidades da nossa comunidade local.
            </p>
          </section>

          <section>
            <h2>Nossa Missão</h2>
            <p>
              Facilitar a vida dos moradores de Itagi e região, proporcionando um ambiente 
              digital onde seja possível anunciar produtos, serviços, imóveis e vagas de emprego 
              de maneira simples, rápida e acessível a todos.
            </p>
          </section>

          <section>
            <h2>Nossos Valores</h2>
            <ul>
              <li><strong>Confiança:</strong> Priorizamos a segurança em todas as negociações</li>
              <li><strong>Comunidade:</strong> Foco no desenvolvimento e comércio local</li>
              <li><strong>Simplicidade:</strong> Interface limpa e fácil de usar no celular ou PC</li>
              <li><strong>Gratuidade:</strong> Anúncios básicos sempre gratuitos para a população</li>
            </ul>
          </section>

          {/* 🤝 NOVO BLOCO: CONVITE À COLABORAÇÃO E FEEDBACK */}
          <section className="colaboracao-section">
            <h2>🤝 Ajude-nos a Construir um Portal Melhor</h2>
            <p>
              O <strong>Itagi Classificados</strong> é uma ferramenta feita por e para os moradores da nossa terra. 
              Como estamos em constante aprimoramento, a sua experiência ao navegar é o que nos guia!
            </p>
            
            <div className="feedback-card">
              <div className="feedback-card-content">
                <h3>Encontrou alguma falha ou tem uma ideia?</h3>
                <p>
                  Teve alguma dificuldade para criar seu anúncio? Alguma foto não carregou direito, 
                  ou você pensou em uma funcionalidade que facilitaria a vida de todo mundo? 
                  <strong> Sua voz é fundamental para nós.</strong>
                </p>
              </div>

              <Link to="/contato" className="btn-feedback-colaborar">
                💬 Enviar Sugestão ou Reportar Falha
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default Sobre