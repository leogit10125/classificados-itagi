import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (novaSenha.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/password/redefinir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Senha redefinida com sucesso!');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Erro ao redefinir senha');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>❌ Token Inválido</h2>
          <p>Link de recuperação inválido ou expirado.</p>
          <button onClick={() => navigate('/recuperar-senha')} style={styles.button}>
            Solicitar novo link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Redefinir Senha</h2>
        
        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nova Senha:</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                style={styles.passwordInput}
                required
                placeholder="Digite sua nova senha"
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Senha:</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={styles.passwordInput}
                required
                placeholder="Confirme sua nova senha"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>
        
        <button onClick={() => navigate('/login')} style={styles.backButton}>
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    color: '#4361ee',
    marginBottom: '20px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontWeight: 'bold',
    color: '#333'
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  passwordInput: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '100%',
    paddingRight: '45px'
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px'
  },
  button: {
    backgroundColor: '#4361ee',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#666',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%'
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  }
};

export default RedefinirSenha;