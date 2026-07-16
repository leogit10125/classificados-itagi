import request from "./client";

export const AuthAPI = {

    login(email, senha) {

        return request("/login", {

            method: "POST",

            body: JSON.stringify({

                email,

                senha

            })

        });

    }

};