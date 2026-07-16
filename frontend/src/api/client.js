// frontend/src/api/client.js

const API_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {

        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            }),
            ...options.headers
        },

        ...options

    });

    if (!response.ok) {

        throw new Error(`Erro ${response.status}`);

    }

    return response.json();

}

export default request;