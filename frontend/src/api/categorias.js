import { api } from "./client";

export const CategoriasAPI = {

    listar() {
        return api("/categorias");
    },

    slug(slug) {
        return api(`/categorias/${slug}`);
    }

};