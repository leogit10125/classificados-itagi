import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AdsAPI } from "../../api";

import "./EditarAnuncio.css";

import StatsCard from "./components/StatsCard";
import PremiumCard from "./components/PremiumCard";
import GalleryManager from "./components/GalleryManager";
import EditForm from "./components/EditForm";
import DangerZone from "./components/DangerZone";

function EditarAnuncio() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [anuncio, setAnuncio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        preco: "",
        categoria: "",
        localizacao: ""
    });

    useEffect(() => {

        async function carregar() {

            try {

                const data = await AdsAPI.buscar(id);

                setAnuncio(data);

                setForm({
                    titulo: data.titulo ?? "",
                    descricao: data.descricao ?? "",
                    preco: data.preco ?? "",
                    categoria: data.categoria ?? "",
                    localizacao: data.localizacao ?? ""
                });

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        carregar();

    }, [id]);


    function handleChange(event) {

        const { name, value } = event.target;

        setForm((dados) => ({
            ...dados,
            [name]: value
        }));

    }


    async function handleSubmit(event) {

        event.preventDefault();

        try {

            setSaving(true);

            const resposta = await AdsAPI.atualizar(id, form);

            if (resposta.anuncio) {
                setAnuncio(resposta.anuncio);
            }

            alert(
                resposta.message ||
                "Anúncio atualizado com sucesso."
            );

        } catch (err) {

            console.error(err);

            alert(
                err.message ||
                "Não foi possível atualizar o anúncio."
            );

        } finally {

            setSaving(false);

        }

    }


    async function handleDelete() {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este anúncio?"
        );

        if (!confirmar) return;

        try {

            await AdsAPI.excluir(id);

            alert("Anúncio excluído com sucesso.");

            navigate("/meus-anuncios");

        } catch (err) {

            console.error(err);

            alert(
                err.message ||
                "Não foi possível excluir o anúncio."
            );

        }

    }


    if (loading) {

        return (
            <div className="edit-loading">
                Carregando anúncio...
            </div>
        );

    }


    if (!anuncio) {

        return (
            <div className="edit-loading">
                Anúncio não encontrado.
            </div>
        );

    }


    return (

        <div className="edit-page">

            <div className="edit-container">

                <header className="edit-header">

                    <h1>✏ Editar anúncio</h1>

                    <p>
                        Atualize informações, destaque seu anúncio e gerencie suas imagens.
                    </p>

                </header>


                <StatsCard
                    anuncio={anuncio}
                />


                <PremiumCard
                    anuncio={anuncio}
                    setAnuncio={setAnuncio}
                />


                <GalleryManager
                    anuncio={anuncio}
                />


                <EditForm
                    anuncio={anuncio}
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    saving={saving}
                />


                <DangerZone
                    onDelete={handleDelete}
                />

            </div>

        </div>

    );

}

export default EditarAnuncio;