import { api } from "./client";

export const PasswordAPI = {

    recuperar(email) {
        return api("/auth/esqueci-senha", {
            method: "POST",
            body: JSON.stringify({ email })
        });
    },

    redefinir(token, senha) {
        return api(`/auth/resetar-senha/${token}`, {
            method: "POST",
            body: JSON.stringify({ senha })
        });
    }

};