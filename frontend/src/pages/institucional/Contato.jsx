// src/pages/institucional/Contato.jsx
import { Link } from "react-router-dom"
import { useState } from "react"
import "./Institucional.css"

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Mensagem enviada com sucesso! (modo demonstração)")
  }

  return (
    <div className="institucional-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Fale Conosco</span>
        </div>

        <div className="institucional-header">
          <h1>Fale Conosco</h1>
          <p className="subtitle">Tire suas dúvidas ou envie sugestões</p>
        </div>

        <div className="institucional-content contato-content">
          <div className="contato-grid">
            <div className="contato-info">
              <h3>Outras formas de contato</h3>
              
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <strong>E-mail:</strong>
                  <p>contato@itagiclassificados.com.br</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📱</span>
                <div>
                  <strong>WhatsApp:</strong>
                  <p>(73) 99999-9999</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Endereço:</strong>
                  <p>Itagi, Bahia</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">⏰</span>
                <div>
                  <strong>Horário de atendimento:</strong>
                  <p>Segunda a Sexta, 8h às 18h</p>
                </div>
              </div>
            </div>

            <form className="contato-form" onSubmit={handleSubmit}>
              <h3>Envie uma mensagem</h3>
              
              <div className="form-group">
                <label>Seu nome</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Seu e-mail</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Mensagem</label>
                <textarea 
                  rows="5" 
                  required
                  value={formData.mensagem}
                  onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn-enviar">Enviar mensagem</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contato