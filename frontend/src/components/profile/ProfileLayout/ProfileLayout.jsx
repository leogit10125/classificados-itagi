import { useEffect, useState } from "react";
import { API_URL } from "../../../config/api";

import Sidebar from "../Sidebar";
import TopBar from "../TopBar";

import AdManagerCard from "../AdManagerCard";
import EmptyState from "../EmptyState";
import UserCard from "../UserCard";
import StatsHeader from "../StatsHeader";

import "./ProfileLayout.css";


function ProfileLayout({ children }) {

    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");


    async function carregarAnuncios(){

        try{

            const response = await fetch(
                `${API_URL}/ads/meus-anuncios`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if(data.success){

                setAnuncios(data.anuncios || []);

            }else{

                setAnuncios([]);

            }


        }catch(error){

            console.error(
                "Erro ao carregar anúncios:",
                error
            );

        }finally{

            setLoading(false);

        }

    }



    useEffect(()=>{

        carregarAnuncios();

    },[]);



    function editarAnuncio(id){

        window.location.href =
        `/editar-anuncio/${id}`;

    }



    async function excluirAnuncio(id){

        const confirmar =
        window.confirm(
            "Deseja excluir este anúncio?"
        );


        if(!confirmar) return;


        try{


            const response =
            await fetch(
                `${API_URL}/ads/${id}`,
                {
                    method:"DELETE",
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            if(response.ok){

                setAnuncios(
                    anuncios.filter(
                        ad=>ad.id!==id
                    )
                );

            }


        }catch(error){

            console.error(error);

        }

    }



    function toggleDestaque(anuncio){

        console.log(
            "Destaque:",
            anuncio
        );

        alert(
            "Sistema de destaque será ativado na próxima etapa."
        );

    }



    const total =
    anuncios.length;


    const ativos =
    anuncios.filter(
        ad=>ad.status==="active"
    ).length;


    const destaques =
    anuncios.filter(
        ad=>ad.destaque===1
    ).length;



    return (

<div className="profile-layout">

    <Sidebar />

    <main className="profile-content">

        <TopBar />

        <UserCard />

        <StatsHeader
            total={total}
            ativos={ativos}
            destaques={destaques}
            creditos={0}
        />

        <section className="profile-section">

            {children}

            {

                loading ?

                <p>Carregando...</p>

                :

                anuncios.length === 0 ?

                <EmptyState />

                :

                anuncios.map((anuncio)=>(

                    <AdManagerCard
                        key={anuncio.id}
                        anuncio={anuncio}
                        onEdit={editarAnuncio}
                        onDelete={excluirAnuncio}
                        onToggleDestaque={toggleDestaque}
                    />

                ))

            }

        </section>

    </main>

</div>

);

}


export default ProfileLayout;