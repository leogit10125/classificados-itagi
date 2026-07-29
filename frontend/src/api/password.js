import { api } from "./client";

export const PasswordAPI = {

    recuperar(email) {
        return api("/password/recuperar", {
            method: "POST",
            body: { email }
        });
    },

    redefinir(token, senha) {
        return api("/password/redefinir", {
            method: "POST",
            body: { token, senha }
        });
    }

};