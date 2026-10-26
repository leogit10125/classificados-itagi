import React, { useState, useEffect } from 'react';

// Dicionário para traduzir os códigos meteorológicos mundiais (WMO)
const interpretarClima = (code) => {
  if (code === 0) return { texto: 'Céu limpo', icone: '☀️' };
  if ([1, 2, 3].includes(code)) return { texto: 'Parcialmente nublado', icone: '⛅' };
  if ([45, 48].includes(code)) return { texto: 'Nevoeiro', icone: '🌫️' };
  if ([51, 53, 55, 61, 63, 65].includes(code)) return { texto: 'Chuva', icone: '🌧️' };
  if ([80, 81, 82].includes(code)) return { texto: 'Pancadas de chuva', icone: '🌦️' };
  if ([95, 96, 99].includes(code)) return { texto: 'Trovoadas', icone: '⛈️' };
  return { texto: 'Tempo estável', icone: '🌤️' };
};

export function ClimaItagi() {
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Coordenadas exatas de Itagi - BA
    const LATITUDE = -14.126;
    const LONGITUDE = -39.846;

    async function buscarClima() {
      try {
        const resposta = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo`
        );
        const dados = await resposta.json();

        const temperatura = Math.round(dados.current.temperature_2m);
        const infoClima = interpretarClima(dados.current.weather_code);

        setClima({
          temperatura,
          texto: infoClima.texto,
          icone: infoClima.icone
        });
      } catch (erro) {
        console.error('Erro ao buscar clima de Itagi:', erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarClima();
    
    // Atualiza o clima automaticamente a cada 30 minutos
    const intervalo = setInterval(buscarClima, 30 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  if (carregando) {
    return (
      <div style={estilos.container}>
        <span style={estilos.cidade}>📍 Itagi</span>
        <span>⏳ Carregando clima...</span>
      </div>
    );
  }

  if (!clima) {
    return (
      <div style={estilos.container}>
        <span style={estilos.cidade}>📍 Itagi</span>
        <span>🌤️ 26°C</span>
      </div>
    );
  }

  return (
    <div style={estilos.container} title={`Clima agora em Itagi: ${clima.texto}`}>
      <span style={estilos.cidade}>📍 Itagi</span>
      <span style={estilos.icone}>{clima.icone}</span>
      <span style={estilos.temperatura}>{clima.temperatura}°C</span>
      <span style={estilos.condicao}>{clima.texto}</span>
    </div>
  );
}

const estilos = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 10px',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '500',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  cidade: {
    color: '#facc15', // Amarelo elegante
    fontWeight: 'bold',
  },
  icone: {
    fontSize: '1rem',
  },
  temperatura: {
    fontWeight: 'bold',
  },
  condicao: {
    opacity: 0.85,
    fontSize: '0.78rem',
  }
};