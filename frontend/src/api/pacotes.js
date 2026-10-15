import { api } from "./client";

export const PacotesAPI = {

    listar() {
        return api("/pacotes");
    },

    creditos() {
        return api("/pacotes/creditos");
    },

    comprar(dados) {
        return api("/pacotes/comprar", {
            method: "POST",
            body: JSON.stringify(dados)
        });
    }

};