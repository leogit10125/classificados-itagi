import "./UserCard.css";

function UserCard() {

    const usuario = JSON.parse(
        localStorage.getItem("usuario") || "{}"
    );

    return (

        <div className="user-card">

            <div className="avatar">

                {usuario.nome
                    ? usuario.nome.charAt(0).toUpperCase()
                    : "U"}

            </div>

            <div className="user-info">

                <h3>
                    {usuario.nome || "Usuário"}
                </h3>

                <p>
                    {usuario.email || "email@exemplo.com"}
                </p>

                <span className="plano">
                    Plano Gratuito
                </span>

            </div>

        </div>

    );

}

export default UserCard;