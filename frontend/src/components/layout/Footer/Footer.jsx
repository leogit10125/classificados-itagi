// src/components/Footer/Footer.jsx
import { Link } from "react-router-dom"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Itagi Classificados</h3>
            <p>Conectando pessoas para comprar, vender e anunciar em Itagi e região.</p>
          </div>

          <div className="footer-section">
            <h4>Institucional</h4>
            <ul>
              <li><Link to="/sobre">Quem Somos</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contato">Fale Conosco</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/politicas">Políticas de Privacidade</Link></li>
              <li><Link to="/termos">Termos de Uso</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Anuncie</h4>
            <ul>
              <li><Link to="/anunciar">Criar anúncio grátis</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Itagi Classificados. Todos os direitos reservados.</p>
          <p>Feito com ❤️ em Itagi, Bahia</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer