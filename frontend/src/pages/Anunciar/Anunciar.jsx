// src/pages/Anunciar/Anunciar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Anunciar.css";

function Anunciar() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    categoria: '',
    localizacao: 'itagi'
  });
  
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // NOVOS STATES PARA LIMITE DE ANÚNCIOS
  const [creditInfo, setCreditInfo] = useState(null);
  const [showPacotes, setShowPacotes] = useState(false);
  const [pacotes, setPacotes] = useState([]);

  // Lista completa de cidades da região e povoados de Itagi
  const localizacoes = [
    // Cidades principais da região
    { value: 'itagi', label: 'Itagi' },
    { value: 'jequie', label: 'Jequié' },
    { value: 'ipiau', label: 'Ipiaú' },
    { value: 'jitauna', label: 'Jitaúna' },
    { value: 'apitanga', label: 'Apuarema' },
    { value: 'wenceslau_guimaraes', label: 'Wenceslau Guimarães' },
    { value: 'ubaíra', label: 'Ubaíra' },
    { value: 'nova_itarana', label: 'Nova Itarana' },
    { value: 'itaquara', label: 'Itaquara' },
    { value: 'planaltino', label: 'Planaltino' },
    { value: 'lajedo_do_tabocal', label: 'Lajedo do Tabocal' },
    { value: 'mara', label: 'Maraú' },
    { value: 'itatim', label: 'Itatim' },
    { value: 'milagres', label: 'Milagres' },
    { value: 'brejões', label: 'Brejões' },
    { value: 'cravolandia', label: 'Cravolândia' },
    { value: 'sta_ines', label: 'Santa Inês' },
    { value: 'valenca', label: 'Valença' },
    
    // Povoados e distritos de Itagi
    { value: 'santa_rita', label: 'Santa Rita' },
    { value: 'itambe', label: 'Itambé' },
    { value: 'cafezal', label: 'Cafezal' },
    { value: 'baixao', label: 'Baixão' },
    { value: 'boa_vista', label: 'Boa Vista' },
    { value: 'sao_jose', label: 'São José' },
    { value: 'gameleira', label: 'Gameleira' },
    { value: 'lagoa_do_meio', label: 'Lagoa do Meio' },
    { value: 'pedra_branca', label: 'Pedra Branca' },
    { value: 'ponto_novo', label: 'Ponto Novo' },
    { value: 'tapirama', label: 'Tapirama' },
    { value: 'vitoria', label: 'Vitória' },
    { value: 'sapucaia', label: 'Sapucaia' },
    { value: 'areia_branca', label: 'Areia Branca' },
    { value: 'cascalheira', label: 'Cascalheira' },
    { value: 'limoeiro', label: 'Limoeiro' },
    { value: 'morro_redondo', label: 'Morro Redondo' },
    { value: 'novo_horizonte', label: 'Novo Horizonte' },
    { value: 'palmeira', label: 'Palmeira' },
    { value: 'serra_verde', label: 'Serra Verde' },
    { value: 'tabocas', label: 'Tabocas' },
    { value: 'terra_nova', label: 'Terra Nova' },
    { value: 'zumbi', label: 'Zumbi' }
  ];

  // Agrupar localizações por categoria
  const localizacoesAgrupadas = {
    cidades: localizacoes.slice(0, 16),
    povoados: localizacoes.slice(16)
  };

  // NOVA FUNÇÃO: Carregar informações de créditos
  const carregarCreditos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/pacotes/creditos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCreditInfo(data);
      }
    } catch (err) {
      console.error('Erro ao carregar créditos:', err);
    }
  };

  // NOVA FUNÇÃO: Carregar pacotes
  const carregarPacotes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pacotes');
      const data = await response.json();
      setPacotes(data);
    } catch (err) {
      console.error('Erro ao carregar pacotes:', err);
    }
  };

  // NOVA FUNÇÃO: Comprar pacote
  const comprarPacote = async (pacote) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/pacotes/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pacoteId: pacote.id,
          quantidade: pacote.quantidade,
          valor: pacote.preco
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setShowPacotes(false);
        await carregarCreditos(); // Recarregar créditos
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao processar compra');
      }
    } catch (err) {
      console.error('Erro na compra:', err);
      alert('Erro de conexão');
    }
  };

  // Carregar créditos ao montar o componente
  useEffect(() => {
    carregarCreditos();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert("Você pode enviar no máximo 5 imagens.");
      return;
    }

    setImages(files);
    
    // Limpar previews anteriores
    previewImages.forEach(url => URL.revokeObjectURL(url));
    
    // Criar novos previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Você precisa estar logado para anunciar!');
        navigate('/login');
        return;
      }

      // VERIFICAR SE TEM CRÉDITOS DISPONÍVEIS
      if (creditInfo) {
        const temGratuito = creditInfo.anunciosGratuitosRestantes > 0;
        const temPago = creditInfo.creditosPagosDisponiveis > 0;
        
        if (!temGratuito && !temPago) {
          await carregarPacotes();
          setShowPacotes(true);
          setLoading(false);
          return;
        }
      }

      const formDataObj = new FormData();
      formDataObj.append('titulo', formData.titulo);
      formDataObj.append('descricao', formData.descricao);
      formDataObj.append('preco', formData.preco);
      formDataObj.append('categoria', formData.categoria);
      formDataObj.append('localizacao', formData.localizacao);
      
      images.forEach((file) => {
        formDataObj.append('imagens', file);
      });

      console.log('📤 Enviando anúncio...');
      
      const response = await fetch('http://localhost:3000/api/ads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });
      
      const result = await response.json();
      console.log('📥 Resposta:', result);
      
      // VERIFICAR SE PRECISA PAGAR (status 402)
      if (response.status === 402) {
        setPacotes(result.pacotes || []);
        setShowPacotes(true);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Erro ao criar anúncio');
      }
      
      alert(result.mensagem || '✅ Anúncio criado com sucesso!');
      navigate('/meus-anuncios');
      
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('Erro ao criar anúncio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { value: 'vendas', label: 'Vendas' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'imoveis', label: 'Imóveis' },
    { value: 'empregos', label: 'Empregos' },
    { value: 'veiculos', label: 'Veículos' },
    { value: 'eletronicos', label: 'Eletrônicos' },
    { value: 'eletrodomesticos', label: 'Eletrodomésticos' },
    { value: 'informatica', label: 'Informática' },
    { value: 'moda', label: 'Moda' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'outros', label: 'Outros' }
    
  ];

  return (
    <div className="anunciar-container">
      <h2 className="anunciar-title">Criar Novo Anúncio</h2>
      
      {/* NOVO: Exibir informações de créditos */}
      {creditInfo && (
        <div className="credit-info-container">
          <div className="credit-card gratuitos">
            <span>🎁 Gratuitos</span>
            <strong>{creditInfo.anunciosGratuitosRestantes}</strong>
            <small>restante(s)</small>
          </div>
          <div className="credit-card pagos">
            <span>💰 Pagos</span>
            <strong>{creditInfo.creditosPagosDisponiveis}</strong>
            <small>disponível(is)</small>
          </div>
          {creditInfo.anunciosGratuitosRestantes === 0 && creditInfo.creditosPagosDisponiveis === 0 && (
            <div className="credit-warning">
              ⚠️ Você atingiu o limite de anúncios gratuitos. Adquira um pacote!
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="anunciar-form">
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            required
            className="form-input"
            placeholder="Ex: iPhone 12, Sofá 3 lugares..."
          />
        </div>
        
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            className="form-textarea"
            placeholder="Descreva o produto em detalhes..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.preco}
            onChange={(e) => setFormData({...formData, preco: e.target.value})}
            required
            className="form-input"
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label>Categoria:</label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
            className="form-select"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Localização:</label>
          <select
            value={formData.localizacao}
            onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
            className="form-select"
            required
          >
            <optgroup label="🏙️ Cidades da Região">
              {localizacoesAgrupadas.cidades.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="🏘️ Povoados de Itagi">
              {localizacoesAgrupadas.povoados.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </optgroup>
          </select>
          <small className="location-hint">
            Selecione a cidade ou povoado onde o anúncio será publicado
          </small>
        </div>
        
        <div className="form-group">
          <label>Imagens (máx 5):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          
          {previewImages.length > 0 && (
            <div className="preview-container">
              {previewImages.map((src, index) => (
                <img 
                  key={index}
                  src={src} 
                  alt={`Preview ${index + 1}`} 
                  className="preview-image"
                />
              ))}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Enviando anúncio...' : '📢 Publicar Anúncio'}
        </button>
      </form>

      {/* NOVO: Modal de Pacotes */}
      {showPacotes && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>💰 Adquirir Pacote de Anúncios</h2>
            <p>Você já usou seus 2 anúncios gratuitos. Escolha um pacote:</p>
            
            <div className="packages-grid">
              {pacotes.map(pacote => (
                <div key={pacote.id} className="package-card">
                  <h3>{pacote.nome}</h3>
                  <p className="quantity">{pacote.quantidade} anúncios</p>
                  <p className="price">R$ {pacote.preco.toFixed(2)}</p>
                  {pacote.destaque && <span className="badge">⭐ Destaque</span>}
                  <button onClick={() => comprarPacote(pacote)}>
                    Comprar
                  </button>
                </div>
              ))}
            </div>
            
            <button className="close-modal" onClick={() => setShowPacotes(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Anunciar;