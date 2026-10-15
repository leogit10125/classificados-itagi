// src/pages/institucional/Politicas.jsx
import { Link } from "react-router-dom"
import "./Institucional.css"

function Politicas() {
  return (
    <div className="institucional-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Políticas de Privacidade</span>
        </div>

        <div className="institucional-header">
          <h1>Políticas de Privacidade</h1>
          <p className="subtitle">Como protegemos seus dados</p>
        </div>

        <div className="institucional-content">
          <section>
            <h2>1. Coleta de Informações</h2>
            <p>Coletamos as seguintes informações quando você utiliza nossa plataforma:</p>
            <ul>
              <li>Nome, e-mail e telefone (para criar anúncios)</li>
              <li>Fotos e descrições dos produtos</li>
              <li>Dados de navegação (cookies)</li>
            </ul>
          </section>

          <section>
            <h2>2. Uso das Informações</h2>
            <p>Utilizamos seus dados para:</p>
            <ul>
              <li>Criar e gerenciar seus anúncios</li>
              <li>Facilitar o contato entre compradores e vendedores</li>
              <li>Melhorar nossos serviços</li>
              <li>Prevenir fraudes</li>
            </ul>
          </section>

          <section>
            <h2>3. Compartilhamento de Dados</h2>
            <p>Não vendemos seus dados. Eles são compartilhados apenas:</p>
            <ul>
              <li>Com outros usuários para viabilizar negociações</li>
              <li>Com autoridades quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2>4. Seus Direitos</h2>
            <p>Você tem direito a:</p>
            <ul>
              <li>Acessar seus dados</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão da conta</li>
            </ul>
          </section>

          <div className="atualizacao">
            <p><strong>Última atualização:</strong> 14 de fevereiro de 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Politicas