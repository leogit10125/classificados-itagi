// frontend/src/api/ads.js

import request from "./client";

export const AdsAPI = {

    listar() {

        return request("/ads");

    },

    buscar(id) {

        return request(`/ads/${id}`);

    },

    meus() {

        return request("/ads/meus-anuncios");

    },

    criar(dados) {

        return request("/ads", {

            method: "POST",

            body: JSON.stringify(dados)

        });

    }

};