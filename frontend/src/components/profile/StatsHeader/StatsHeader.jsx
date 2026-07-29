import "./StatsHeader.css";

function StatsHeader({
  total = 0,
  ativos = 0,
  destaques = 0,
  creditos = 0,
}) {
  return (
    <div className="stats-header">

      <div className="stat-box">
        <span className="numero">{total}</span>
        <span className="titulo">Anúncios</span>
      </div>

      <div className="stat-box">
        <span className="numero">{ativos}</span>
        <span className="titulo">Ativos</span>
      </div>

      <div className="stat-box">
        <span className="numero">{destaques}</span>
        <span className="titulo">Destaques</span>
      </div>

      <div className="stat-box">
        <span className="numero">{creditos}</span>
        <span className="titulo">Créditos</span>
      </div>

    </div>
  );
}

export default StatsHeader;