import request from "./client";

export const CategoriasAPI = {

    listar() {

        return request("/categorias");

    }

};
