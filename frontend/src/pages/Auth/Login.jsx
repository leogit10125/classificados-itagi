// frontend/src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('teste@teste.com');
  const [senha, setSenha] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('📤 Tentando login com:', { email, senha });
      
      // ✅ URL COMPLETA
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });
      
      console.log('📡 Status:', response.status);
      
      const data = await response.json();
      console.log('📥 Resposta:', data);
      
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.user));
        alert('Login realizado com sucesso!');
        navigate('/');
      } else {
        setError(data.error || 'Email ou senha inválidos');
      }
    } catch (error) {
      console.error('❌ Erro:', error);
      setError('Erro de conexão: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Login</h2>
        <p>Use: teste@teste.com / 123456</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Senha:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          
          <div className="forgot-password">
            <button type="button" onClick={() => navigate('/recuperar-senha')}>
              Esqueceu sua senha?
            </button>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="register-link">
          Não tem uma conta? <button onClick={() => navigate('/registro')}>Cadastre-se</button>
        </div>
      </div>
    </div>
  );
}

export default Login;