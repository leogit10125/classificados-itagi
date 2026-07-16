import request from "./client";

export const PerfilAPI = {

    dados() {

        return request("/perfil");

    }

};