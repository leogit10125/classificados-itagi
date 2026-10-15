const express = require("express");
console.log("✅ adRoutes carregado");
const router = express.Router();
console.log("✅ Router criado");

const db = require("../config/db");
const upload = require("../middleware/upload");
const uploadToCloudinary = require("../middleware/uploadToCloudinary");
const authMiddleware = require("../middleware/auth");
const checkAdLimit = require("../middleware/checkAdLimit");

const fs = require("fs");
const path = require("path");

/* ==========================================================
   PROCESSAR IMAGENS
========================================================== */

function processarImagens(imagensRaw) {

    try {

        if (!imagensRaw) return [];

        if (Array.isArray(imagensRaw))
            return imagensRaw;

        if (typeof imagensRaw === "string") {

            // JSON
            if (imagensRaw.startsWith("[")) {

                return JSON.parse(imagensRaw);

            }

            // CSV
            if (imagensRaw.includes(",")) {

                return imagensRaw
                    .split(",")
                    .map(img => img.trim())
                    .filter(Boolean);

            }

            return [imagensRaw];

        }

    } catch (err) {

        console.error("Erro ao converter imagens:", err);

    }

    return [];

}

/* ==========================================================
   ANÚNCIOS GRATUITOS
========================================================== */

async function getGratuitosRestantes(usuarioId) {

    const [rows] = await db.query(

        `SELECT anuncios_gratuitos_restantes
         FROM usuarios
         WHERE id = ?`,

        [usuarioId]

    );

    if (!rows.length) return 0;

    return rows[0].anuncios_gratuitos_restantes;

}

/* ==========================================================
   LISTAR TODOS OS ANÚNCIOS
========================================================== */
console.log("✅ Registrando rotas de anúncios...");
router.get("/", async (req, res) => {

    try {

        const query = `

            SELECT

                a.*,

                u.nome AS usuario_nome,

                u.telefone

            FROM anuncios a

            LEFT JOIN usuarios u

                ON u.id = a.usuario_id

            WHERE a.status='active'

            ORDER BY a.criado_em DESC

        `;

        const [rows] = await db.query(query);

        const anuncios = rows.map(ad => ({

            ...ad,

            preco: Number(ad.preco),

            imagens: processarImagens(ad.imagens)

        }));

        res.json(anuncios);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Erro ao listar anúncios."

        });

    }

});

/* ==========================================================
   MEUS ANÚNCIOS
========================================================== */

router.get("/meus-anuncios",

authMiddleware,

async (req, res) => {

try{

const usuarioId=req.usuario.id;

const [rows]=await db.query(

`

SELECT

a.*,

u.nome usuario_nome,

u.telefone,

u.email

FROM anuncios a

LEFT JOIN usuarios u

ON u.id=a.usuario_id

WHERE a.usuario_id=?

ORDER BY a.criado_em DESC

`,

[usuarioId]

);

const anuncios=rows.map(ad=>({

...ad,

preco:Number(ad.preco),

imagens:processarImagens(ad.imagens)

}));

res.json({

success:true,

anuncios,

total:anuncios.length

});

}catch(err){

console.error(err);

res.status(500).json({

success:false,

error:"Erro ao buscar anúncios."

});

}

});

/* ==========================================================
   ANÚNCIOS DE UM USUÁRIO
========================================================== */

router.get("/usuario/:userId", async (req,res)=>{

try{

const {userId}=req.params;

const [rows]=await db.query(

`

SELECT *

FROM anuncios

WHERE usuario_id=?

ORDER BY criado_em DESC

`,

[userId]

);

const anuncios=rows.map(ad=>({

...ad,

preco:Number(ad.preco),

imagens:processarImagens(ad.imagens)

}));

res.json(anuncios);

}catch(err){

console.error(err);

res.status(500).json({

error:"Erro ao buscar anúncios."

});

}

});

/* ==========================================================
   DESTAQUES
========================================================== */

router.get("/destaques", async (req,res)=>{

try{

const [rows]=await db.query(

`

SELECT

a.*,

u.nome usuario_nome,

u.telefone

FROM anuncios a

LEFT JOIN usuarios u

ON u.id=a.usuario_id

WHERE

a.status='active'

AND

a.destaque=1

ORDER BY

a.criado_em DESC

LIMIT 5

`

);

const anuncios=rows.map(ad=>({

...ad,

preco:Number(ad.preco),

imagens:processarImagens(ad.imagens)

}));

res.json(anuncios);

}catch(err){

console.error(err);

res.status(500).json({

error:"Erro ao buscar destaques."

});

}

});
/* ==========================================================
   BUSCAR ANÚNCIO POR ID
========================================================== */

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const query = `
            SELECT
                a.*,
                u.nome AS usuario_nome,
                CASE
                    WHEN u.whatsapp_publico = 1 THEN u.telefone
                    ELSE NULL
                END AS telefone,
                u.whatsapp_publico
            FROM anuncios a
            LEFT JOIN usuarios u
                ON u.id = a.usuario_id
            WHERE a.id = ?
        `;

        const [rows] = await db.query(query, [id]);

        if (!rows.length) {

            return res.status(404).json({

                error: "Anúncio não encontrado."

            });

        }

        const anuncio = rows[0];

        res.json({

            ...anuncio,

            preco: Number(anuncio.preco),

            imagens: processarImagens(anuncio.imagens)

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: "Erro ao buscar anúncio."

        });

    }

});

/* ==========================================================
   CRIAR NOVO ANÚNCIO
========================================================== */

router.post(
    "/",
    authMiddleware,
    checkAdLimit,
    upload.array("imagens", 5),
    uploadToCloudinary,

    async (req, res) => {

        try {

            const usuarioId = req.usuario.id;

            const {

                titulo,

                descricao,

                preco,

                categoria,

                localizacao

            } = req.body;

            const adType = req.adType;

            let imagens = [];

            if (req.files && req.files.length) {

                imagens = req.files.map(file => file.filename);

            }

            const query = `

                INSERT INTO anuncios (

                    titulo,

                    descricao,

                    preco,

                    categoria,

                    localizacao,

                    imagens,

                    usuario_id,

                    criado_em

                )

                VALUES (?,?,?,?,?,?,?,NOW())

            `;

            const [result] = await db.query(

                query,

                [

                    titulo,

                    descricao,

                    Number(preco),

                    categoria,

                    localizacao,

                    JSON.stringify(imagens),

                    usuarioId

                ]

            );

            if (adType === "gratuito") {

                await db.query(

                    `

                    UPDATE usuarios

                    SET anuncios_gratuitos_restantes =

                    anuncios_gratuitos_restantes - 1

                    WHERE id = ?

                    `,

                    [usuarioId]

                );

                const restantes = await getGratuitosRestantes(usuarioId);

                return res.status(201).json({

                    success: true,

                    id: result.insertId,

                    imagens,

                    restantes,

                    mensagem:

                        `✅ Anúncio criado com sucesso. Restam ${restantes} anúncio(s) gratuito(s).`

                });

            }

            const [usuarios] = await db.query(

                `

                SELECT

                    pacote_anuncios,

                    anuncios_pagos

                FROM usuarios

                WHERE id=?

                `,

                [usuarioId]

            );

            if (usuarios.length) {

                const usuario = usuarios[0];

                if (usuario.pacote_anuncios > 0) {

                    await db.query(

                        `

                        UPDATE usuarios

                        SET pacote_anuncios =

                        pacote_anuncios - 1

                        WHERE id=?

                        `,

                        [usuarioId]

                    );

                } else if (usuario.anuncios_pagos > 0) {

                    await db.query(

                        `

                        UPDATE usuarios

                        SET anuncios_pagos =

                        anuncios_pagos - 1

                        WHERE id=?

                        `,

                        [usuarioId]

                    );

                }

            }

            res.status(201).json({

                success: true,

                id: result.insertId,

                imagens,

                mensagem: "✅ Anúncio publicado com sucesso."

            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                error: "Erro ao criar anúncio."

            });

        }

    }

);
/* ==========================================================
   TORNAR ANÚNCIO PREMIUM
========================================================== */

router.post(
    "/:id/destaque",
    authMiddleware,
    async (req, res) => {

        try {

            const { id } = req.params;
            const usuarioId = req.usuario.id;

            const [rows] = await db.query(
                `
                SELECT *
                FROM anuncios
                WHERE id = ?
                AND usuario_id = ?
                `,
                [id, usuarioId]
            );

            if (!rows.length) {

                return res.status(404).json({
                    error: "Anúncio não encontrado."
                });

            }

            await db.query(
                `
                UPDATE anuncios
                SET destaque = 1
                WHERE id = ?
                `,
                [id]
            );

            res.json({
                success: true,
                message: "Anúncio promovido para destaque."
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                error: "Erro ao promover anúncio."
            });

        }

    }
);
/* ==========================================================
   EXCLUIR ANÚNCIO
========================================================== */

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const { id } = req.params;
            const usuarioId = req.usuario.id;

            // Buscar somente anúncio pertencente ao usuário logado
            const [rows] = await db.query(
                `
                SELECT id, imagens
                FROM anuncios
                WHERE id = ?
                AND usuario_id = ?
                `,
                [id, usuarioId]
            );

            if (!rows.length) {

                return res.status(404).json({
                    error: "Anúncio não encontrado."
                });

            }

            const anuncio = rows[0];

            // Processar nomes das imagens
            const imagens = processarImagens(anuncio.imagens);

            // Remover arquivos físicos
            for (const imagem of imagens) {

                if (!imagem) continue;

                const caminhoImagem = path.join(
                    __dirname,
                    "..",
                    "uploads",
                    imagem
                );

                try {

                    if (fs.existsSync(caminhoImagem)) {

                        fs.unlinkSync(caminhoImagem);

                        console.log(
                            `🗑️ Imagem removida: ${imagem}`
                        );

                    }

                } catch (erroImagem) {

                    console.error(
                        `⚠️ Erro ao remover imagem ${imagem}:`,
                        erroImagem.message
                    );

                }

            }

            // Remover anúncio
            await db.query(
                `
                DELETE FROM anuncios
                WHERE id = ?
                AND usuario_id = ?
                `,
                [id, usuarioId]
            );

            res.json({

                success: true,

                message: "Anúncio excluído com sucesso."

            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                error: "Erro ao excluir anúncio."

            });

        }

    }
);
/* ==========================================================
   ATUALIZAR ANÚNCIO
========================================================== */

router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const { id } = req.params;
            const usuarioId = req.usuario.id;

            const {
                titulo,
                descricao,
                preco,
                categoria,
                localizacao
            } = req.body;

            // Verificar se o anúncio pertence ao usuário
            const [rows] = await db.query(
                `
                SELECT id
                FROM anuncios
                WHERE id = ?
                AND usuario_id = ?
                `,
                [id, usuarioId]
            );

            if (!rows.length) {

                return res.status(404).json({
                    error: "Anúncio não encontrado."
                });

            }

            // Atualizar somente os dados do anúncio
            await db.query(
                `
                UPDATE anuncios
                SET
                    titulo = ?,
                    descricao = ?,
                    preco = ?,
                    categoria = ?,
                    localizacao = ?
                WHERE id = ?
                AND usuario_id = ?
                `,
                [
                    titulo,
                    descricao,
                    preco !== undefined && preco !== ""
                        ? Number(preco)
                        : null,
                    categoria,
                    localizacao,
                    id,
                    usuarioId
                ]
            );

            // Buscar anúncio atualizado
            const [atualizados] = await db.query(
                `
                SELECT *
                FROM anuncios
                WHERE id = ?
                AND usuario_id = ?
                `,
                [id, usuarioId]
            );

            const anuncio = atualizados[0];

            res.json({
                success: true,
                message: "Anúncio atualizado com sucesso.",
                anuncio: {
                    ...anuncio,
                    preco: Number(anuncio.preco),
                    imagens: processarImagens(anuncio.imagens)
                }
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                error: "Erro ao atualizar anúncio."
            });

        }

    }
);
module.exports = router;