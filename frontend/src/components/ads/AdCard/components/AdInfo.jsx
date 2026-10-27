import React from "react";
import "./AdInfo.css";

function AdInfo({ anuncio }) {
    // Formatação de Preço brasileira
    const precoFormatado = Number(anuncio.preco || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const local = anuncio.localizacao 
        ? anuncio.localizacao.charAt(0).toUpperCase() + anuncio.localizacao.slice(1).toLowerCase()
        : "Itagi";

    const categoria = anuncio.categoria 
        ? anuncio.categoria.charAt(0).toUpperCase() + anuncio.categoria.slice(1).toLowerCase()
        : "Geral";

    // Simulação elegante de avaliações estilo Mercado Livre
    const nota = "4.9";
    const totalAvaliacoes = (anuncio.id * 7) % 25 + 8; // Gera avaliações consistentes (ex: 15, 22)

    return (
        <div className="ml-ad-info">
            {/* 1. TÍTULO */}
            <h3 className="ml-ad-title" title={anuncio.titulo}>
                {anuncio.titulo || "Anúncio sem título"}
            </h3>

            {/* 2. ESTRELAS DE AVALIAÇÃO (ESTILO MERCADO LIVRE) */}
            <div className="ml-rating">
                <span className="ml-stars">★★★★★</span>
                <span className="ml-score">{nota}</span>
                <span className="ml-reviews">({totalAvaliacoes})</span>
            </div>

            {/* 3. PREÇO EM DESTAQUE */}
            <div className="ml-price-container">
                <span className="ml-currency">R$</span>
                <span className="ml-amount">{precoFormatado}</span>
            </div>

            {/* 4. LOCALIZAÇÃO E CATEGORIA (RODAPÉ) */}
            <div className="ml-ad-footer">
                <span className="ml-location">📍 {local}</span>
                <span className="ml-category">{categoria}</span>
            </div>
        </div>
    );
}

export default AdInfo;