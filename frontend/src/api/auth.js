import { api } from "./client";

export const AuthAPI = {

    login(email, senha) {

        return api("/login", {

            method: "POST",

            body: JSON.stringify({
                email,
                senha
            })

        });

    },

    registro(dados) {

        return api("/registro", {

            method: "POST",

            body: JSON.stringify(dados)

        });

    }

};