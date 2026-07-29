import { api } from "./client";

export const PerfilAPI = {

    dados() {
        return api("/perfil");
    }

};