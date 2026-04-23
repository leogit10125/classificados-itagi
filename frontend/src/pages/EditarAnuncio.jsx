import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarAnuncio.css';

function EditarAnuncio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    categoria: '',
    localizacao: ''
  });
  const [imagens, setImagens] = useState([]);
  const [imagensRemover, setImagensRemover] = useState([]);
  const [novasImagens, setNovasImagens] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Carregar dados do anúncio
  useEffect(() => {
    const carregarAnuncio = async () => {
      try {
        console.log('🔍 Carregando anúncio ID:', id);
        
        const response = await fetch(`http://localhost:3000/api/ads/${id}`);
        
        if (!response.ok) {
          throw new Error('Anúncio não encontrado');
        }
        
        const data = await response.json();
        console.log('📦 Dados carregados:', data);
        
        setFormData({
          titulo: data.titulo || '',
          descricao: data.descricao || '',
          preco: data.preco || '',
          categoria: data.categoria || '',
          localizacao: data.localizacao || ''
        });
        
        // Carregar imagens existentes
        if (data.imagens && Array.isArray(data.imagens)) {
          setImagens(data.imagens);
        }
        
      } catch (err) {
        console.error('❌ Erro ao carregar:', err);
        setError('Erro ao carregar anúncio');
      } finally {
        setLoading(false);
      }
    };
    
    if (id && token) {
      carregarAnuncio();
    } else {
      setLoading(false);
      setError('Você precisa estar logado');
    }
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImagemRemover = (imagemNome) => {
    setImagensRemover([...imagensRemover, imagemNome]);
    setImagens(imagens.filter(img => img !== imagemNome));
  };

  const handleImagemAdicionar = (e) => {
    const files = Array.from(e.target.files);
    setNovasImagens([...novasImagens, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setError('');
    
    const formDataEnvio = new FormData();
    formDataEnvio.append('titulo', formData.titulo);
    formDataEnvio.append('descricao', formData.descricao);
    formDataEnvio.append('preco', formData.preco);
    formDataEnvio.append('categoria', formData.categoria);
    formDataEnvio.append('localizacao', formData.localizacao);
    
    // Adicionar imagens a serem removidas
    imagensRemover.forEach(img => {
      formDataEnvio.append('imagensRemover', img);
    });
    
    // Adicionar novas imagens
    novasImagens.forEach(img => {
      formDataEnvio.append('imagens', img);
    });
    
    try {
      console.log('💾 Salvando alterações...');
      
      const response = await fetch(`http://localhost:3000/api/ads/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataEnvio
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Sucesso:', result);
        alert('✅ Anúncio atualizado com sucesso!');
        navigate('/meus-anuncios');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao atualizar');
      }
    } catch (err) {
      console.error('❌ Erro:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="editar-container">
        <p>🔄 Carregando anúncio...</p>
      </div>
    );
  }

  return (
    <div className="editar-container">
      <h2>✏️ Editar Anúncio</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="editar-form">
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Preço (R$):</label>
          <input
            type="number"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Categoria:</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Imóveis">Imóveis</option>
            <option value="Veículos">Veículos</option>
            <option value="Moda">Moda</option>
            <option value="Esportes">Esportes</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Localização:</label>
          <input
            type="text"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            placeholder="Cidade - Estado"
          />
        </div>
        
        {imagens.length > 0 && (
          <div className="form-group">
            <label>Imagens atuais:</label>
            <div className="imagens-preview">
              {imagens.map((img, idx) => (
                <div key={idx} className="imagem-item">
                  <img src={`http://localhost:3000/uploads/${img}`} alt={`Imagem ${idx+1}`} />
                  <button type="button" onClick={() => handleImagemRemover(img)}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label>Adicionar novas imagens:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagemAdicionar}
          />
          {novasImagens.length > 0 && (
            <p>📸 {novasImagens.length} nova(s) imagem(ns) selecionada(s)</p>
          )}
        </div>
        
        <div className="botoes">
          <button type="button" onClick={() => navigate('/meus-anuncios')} className="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" disabled={salvando} className="btn-salvar">
            {salvando ? '💾 Salvando...' : '💾 Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarAnuncio;