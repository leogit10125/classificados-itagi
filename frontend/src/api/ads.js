import { api } from "./client";

export const AdsAPI = {

    listar() {
        return api("/ads");
    },

    buscar(id) {
        return api(`/ads/${id}`);
    },

    destaques() {
        return api("/ads/destaques");
    },

    meus() {
        return api("/ads/meus-anuncios");
    },

    excluir(id) {
        return api(`/ads/${id}`, {
            method: "DELETE"
        });
    },

    atualizar(id, formData) {
        return api(`/ads/${id}`, {
            method: "PUT",
            body: formData
        });
    },

    criar(formData) {
        return api("/ads", {
            method: "POST",
            body: formData
        });
    },


    destacar(id) {

        return api(`/ads/${id}/destaque`, {

            method: "POST"

        });
    },
}