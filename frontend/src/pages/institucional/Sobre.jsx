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
              O <strong>Itagi Classificados</strong> nasceu em 2024 com um objetivo simples: 
              conectar pessoas da nossa cidade para comprar, vender e anunciar produtos e serviços 
              de forma fácil, segura e gratuita.
            </p>
            <p>
              Percebemos que em Itagi e região não existia uma plataforma local de classificados 
              que atendesse às necessidades específicas da nossa comunidade.
            </p>
          </section>

          <section>
            <h2>Nossa Missão</h2>
            <p>
              Facilitar a vida dos moradores de Itagi e região, proporcionando um ambiente 
              digital onde seja possível anunciar produtos, serviços, imóveis e vagas de emprego 
              de maneira simples e acessível.
            </p>
          </section>

          <section>
            <h2>Nossos Valores</h2>
            <ul>
              <li><strong>Confiança:</strong> Priorizamos a segurança em todas as negociações</li>
              <li><strong>Comunidade:</strong> Foco no desenvolvimento local</li>
              <li><strong>Simplicidade:</strong> Interface fácil de usar</li>
              <li><strong>Gratuidade:</strong> Anúncios básicos sempre gratuitos</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Sobre