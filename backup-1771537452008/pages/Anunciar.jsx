// src/pages/Anunciar.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Anunciar.css"

// URL da API
const API_URL = 'http://127.0.0.1:5000/api';

function Anunciar() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  
  const [formData, setFormData] = useState({
    title: "",
    category: "vendas",
    price: "",
    description: "",
    location: "Itagi"
    // ✅ NÃO TEM MAIS name, phone, email
  })

  // Categorias disponíveis
  const categories = [
    { value: "vendas", label: "Vendas" },
    { value: "servicos", label: "Serviços" },
    { value: "imoveis", label: "Imóveis" },
    { value: "empregos", label: "Empregos" },
    { value: "veiculos", label: "Veículos" },
    { value: "eletronicos", label: "Eletrônicos" }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Função para lidar com upload de imagens
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // Limitar a 5 imagens
    if (images.length + files.length > 5) {
      alert("Você pode enviar no máximo 5 imagens")
      return
    }

    // Validar tipo de arquivo
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/')
      if (!isValid) alert(`Arquivo ${file.name} não é uma imagem`)
      return isValid
    })

    // Criar previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    
    setImages([...images, ...validFiles])
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  // Remover imagem
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Liberar memória das URLs criadas
    URL.revokeObjectURL(imagePreviews[index])
    
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('📤 Enviando anúncio...')
      
      // Verificar se está logado
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Você precisa estar logado para anunciar!')
        navigate('/login')
        return
      }
      
      // Criar FormData para enviar arquivos
      const formDataToSend = new FormData()
      
      // Adicionar campos de texto
      formDataToSend.append('titulo', formData.title)
      formDataToSend.append('descricao', formData.description)
      formDataToSend.append('preco', formData.price)
      formDataToSend.append('categoria', formData.category)
      formDataToSend.append('localizacao', formData.location)
      
      // Adicionar imagens
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      // Enviar para a API
      const response = await fetch(`${API_URL}/ads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        const data = await response.json()
        alert("Anúncio publicado com sucesso!")
        navigate("/")
      } else {
        const error = await response.json()
        alert(`Erro: ${error.message || "Erro ao publicar anúncio"}`)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="anunciar-page">
      <div className="container">
        <h1>Criar novo anúncio</h1>
        <p className="subtitle">Preencha os dados abaixo para publicar seu anúncio</p>

        <form onSubmit={handleSubmit} className="anunciar-form" encType="multipart/form-data">
          
          {/* SEÇÃO DE UPLOAD DE IMAGENS */}
          <div className="form-section">
            <h3>Imagens do produto</h3>
            <p className="section-hint">Adicione até 5 imagens (formatos: JPG, PNG, GIF)</p>
            
            <div className="image-upload-container">
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="image-upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <span>+ Adicionar imagem</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Dados do anúncio */}
          <div className="form-section">
            <h3>Dados do anúncio</h3>
            
            <div className="form-group">
              <label>Título do anúncio *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: iPhone 13 Pro 256GB"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço (R$) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 3500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Localização *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Centro, Itagi"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descrição *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva seu produto ou serviço com detalhes..."
                rows="5"
                required
              />
            </div>
          </div>

          {/* INFO: Os dados de contato serão usados do seu perfil */}
          <div className="form-section info-section">
            <p className="info-message">
              📋 Seus dados de contato (nome, telefone e e-mail) serão obtidos automaticamente do seu cadastro.
            </p>
          </div>

          {/* Opção de destaque */}
          <div className="form-section highlight-section">
            <h3>Destaque seu anúncio</h3>
            <div className="highlight-options">
              <label className="highlight-option">
                <input type="radio" name="highlight" value="none" defaultChecked />
                <span>Grátis - Anúncio comum</span>
              </label>
              <label className="highlight-option">
                <input type="radio" name="highlight" value="featured" />
                <span>
                  <strong>Destaque por R$ 5,00</strong>
                  <small>Apareça no topo por 7 dias</small>
                </span>
              </label>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-enviar"
              disabled={loading}
            >
              {loading ? "Publicando..." : "Publicar anúncio"}
            </button>
          </div>

          <p className="form-note">* Campos obrigatórios</p>
        </form>
      </div>
    </div>
  )
}

export default Anunciar