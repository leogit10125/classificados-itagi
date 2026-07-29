import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AdsAPI } from "../../api";

import "./EditarAnuncio.css";

import StatsCard from "./components/StatsCard";
import PremiumCard from "./components/PremiumCard";
import GalleryManager from "./components/GalleryManager";
import EditForm from "./components/EditForm";
import DangerZone from "./components/DangerZone";

function EditarAnuncio() {

    const { id } = useParams();

    const [anuncio, setAnuncio] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function carregar() {

            try {

                const data = await AdsAPI.buscar(id);

                setAnuncio(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        carregar();

    }, [id]);

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

                    <h1>✏️ Editar anúncio</h1>

                    <p>

                        Atualize informações, destaque seu anúncio e gerencie suas imagens.

                    </p>

                </header>

                <StatsCard anuncio={anuncio} />

                <PremiumCard
                    anuncio={anuncio}
                    setAnuncio={setAnuncio}
                />

                <GalleryManager
                    anuncio={anuncio}
                    setAnuncio={setAnuncio}
                />

                <EditForm
                    anuncio={anuncio}
                    setAnuncio={setAnuncio}
                />

                <DangerZone
                    anuncio={anuncio}
                />

            </div>

        </div>

    );

}

export default EditarAnuncio;