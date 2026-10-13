// frontend/src/api/client.js

const API_URL =
    import.meta.env.VITE_API_URL ||
    "/api";

export async function api(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),

        ...(token && {
            Authorization: `Bearer ${token}`
        }),

        ...options.headers
    };

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    if (!response.ok) {

        let erro = `Erro ${response.status}`;

        try {

            const json = await response.json();

            erro = json.error || json.message || erro;

        } catch {

            // ignora caso a resposta não seja JSON

        }

        throw new Error(erro);

    }

    return response.json();

}