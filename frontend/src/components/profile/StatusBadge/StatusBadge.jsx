import "./StatusBadge.css";

function StatusBadge({ status = "active", destaque = 0 }) {

    if (destaque) {
        return (
            <span className="status-badge destaque">
                ⭐ Em destaque
            </span>
        );
    }

    switch (status) {

        case "active":
            return (
                <span className="status-badge ativo">
                    🟢 Ativo
                </span>
            );

        case "paused":
            return (
                <span className="status-badge pausado">
                    🟡 Pausado
                </span>
            );

        case "expired":
            return (
                <span className="status-badge expirado">
                    🔴 Expirado
                </span>
            );

        default:
            return (
                <span className="status-badge">
                    ⚪ Indefinido
                </span>
            );
    }
}

export default StatusBadge;
