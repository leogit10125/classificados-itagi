// frontend/src/pages/Auth/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidEmail, isValidPassword, isValidName, isValidPhone, sanitizeInput, formatPhone } from '../../utils/validators';
import './Auth.css';

function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (!isValidName(formData.nome)) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!isValidPassword(formData.senha)) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }
    
    if (formData.telefone && !isValidPhone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido. Digite pelo menos 10 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({...formData, telefone: formatted});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: sanitizeInput(formData.nome),
          email: formData.email.toLowerCase(),
          senha: formData.senha,
          telefone: formData.telefone.replace(/\D/g, '')
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('✅ Cadastro realizado com sucesso! Faça login.');
        navigate('/login');
      } else {
        setErrors({ submit: data.error || 'Erro ao cadastrar' });
      }
    } catch (error) {
      setErrors({ submit: 'Erro de conexão com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Criar Conta</h2>
        <p>Preencha os dados para se cadastrar</p>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className={errors.nome ? 'error-input' : ''}
              placeholder="Digite seu nome completo"
            />
            {errors.nome && <span className="error-text">{errors.nome}</span>}
          </div>
          
          <div className="form-group">
            <label>E-mail *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={errors.email ? 'error-input' : ''}
              placeholder="seuemail@exemplo.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Senha * (mínimo 6 caracteres)</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                className={errors.senha ? 'error-input' : ''}
                placeholder="Digite sua senha"
              />
            </div>
            {errors.senha && <span className="error-text">{errors.senha}</span>}
          </div>
          
          <div className="form-group">
            <label>Confirmar senha *</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                className={errors.confirmarSenha ? 'error-input' : ''}
                placeholder="Confirme sua senha"
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmarSenha && <span className="error-text">{errors.confirmarSenha}</span>}
          </div>
          
          <div className="form-group">
            <label>Telefone com WhatsApp</label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              className={errors.telefone ? 'error-input' : ''}
            />
            <small className="field-hint">Opcional, mas ajuda no contato</small>
            {errors.telefone && <span className="error-text">{errors.telefone}</span>}
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="register-link">
          Já tem uma conta? <button onClick={() => navigate('/login')}>Faça login</button>
        </div>
      </div>
    </div>
  );
}

export default Registro;