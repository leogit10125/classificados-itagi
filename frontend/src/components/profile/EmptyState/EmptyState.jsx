import "./EmptyState.css";

function EmptyState({
  titulo = "Nenhum anúncio encontrado",
  texto = "Você ainda não possui anúncios publicados.",
  botao = "Criar anúncio",
  onClick,
}) {
  return (
    <div className="empty-state">
      <h2>{titulo}</h2>

      <p>{texto}</p>

      {onClick && (
        <button onClick={onClick}>
          {botao}
        </button>
      )}
    </div>
  );
}

export default EmptyState;