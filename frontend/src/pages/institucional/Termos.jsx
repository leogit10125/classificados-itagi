// src/pages/institucional/Termos.jsx
import { Link } from "react-router-dom"
import "./Institucional.css"

function Termos() {
  return (
    <div className="institucional-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Termos de Uso</span>
        </div>

        <div className="institucional-header">
          <h1>Termos de Uso</h1>
          <p className="subtitle">Regras para utilização da plataforma</p>
        </div>

        <div className="institucional-content">
          <section>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao utilizar o Itagi Classificados, você concorda com estes termos. 
              Se não concordar, não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2>2. Responsabilidades do Usuário</h2>
            <ul>
              <li>Fornecer informações verdadeiras nos anúncios</li>
              <li>Não publicar conteúdo ilegal ou ofensivo</li>
              <li>Respeitar os direitos autorais</li>
              <li>Não praticar golpes ou fraudes</li>
            </ul>
          </section>

          <section>
            <h2>3. Anúncios Pagos</h2>
            <p>
              Ao contratar planos pagos, você concorda com as regras de cobrança e 
              reembolso definidas na plataforma.
            </p>
          </section>

          <section>
            <h2>4. Moderação</h2>
            <p>
              O Itagi Classificados se reserva o direito de remover qualquer anúncio 
              que viole estes termos, sem aviso prévio.
            </p>
          </section>

          <section>
            <h2>5. Limitação de Responsabilidade</h2>
            <p>
              O Itagi Classificados é apenas uma plataforma de intermediação. 
              As negociações são de responsabilidade exclusiva dos usuários.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Termos
