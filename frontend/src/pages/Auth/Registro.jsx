import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthAPI } from "../../api";

import "./Auth.css";

function Registro() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
        confirmarSenha: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        if (form.senha !== form.confirmarSenha) {

            setError("As senhas não conferem.");

            return;

        }

        try {

            setLoading(true);

            await AuthAPI.registro({

                nome: form.nome,
                email: form.email,
                telefone: form.telefone,
                senha: form.senha

            });

            alert("Cadastro realizado com sucesso!");

            navigate("/login");

        } catch (err) {

            console.error(err);

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h2>Criar Conta</h2>

                {error &&

                    <div className="error-message">

                        {error}

                    </div>

                }

                <form onSubmit={handleSubmit}>

                    <input
                        name="nome"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="telefone"
                        placeholder="Telefone"
                        value={form.telefone}
                        onChange={handleChange}
                    />

                    <input
                        name="senha"
                        type="password"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="confirmarSenha"
                        type="password"
                        placeholder="Confirmar senha"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Cadastrando..."
                            : "Cadastrar"}

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Registro;