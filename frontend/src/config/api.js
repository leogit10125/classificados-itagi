export const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api";

export const UPLOADS_URL =
    API_URL.replace("/api", "/uploads");