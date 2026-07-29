import { api } from "./client";

export const StatsAPI = {

    async listar() {

        const data = await api("/stats");

        return {

            anuncios: data.anuncios || 0,
            usuarios: data.usuarios || 0,
            categorias: data.categorias || 0

        };

    }

};