const fs = require("fs");
const path = require("path");
const db = require("../config/db");

async function popularImagens() {
    try {

        const uploadsDir = path.join(__dirname, "../uploads");

        const imagens = fs.readdirSync(uploadsDir)
            .filter(file =>
                /\.(jpg|jpeg|png)$/i.test(file)
            )
            .sort();

        console.log(`📷 ${imagens.length} imagens encontradas.`);

        const [anuncios] = await db.query(`
            SELECT id
            FROM anuncios
            ORDER BY id
        `);

        console.log(`📦 ${anuncios.length} anúncios encontrados.`);

        for (let i = 0; i < anuncios.length; i++) {

            const anuncio = anuncios[i];

            const imagem = imagens[i % imagens.length];

            await db.query(
                `
                UPDATE anuncios
                SET imagens = ?
                WHERE id = ?
                `,
                [
                    JSON.stringify([imagem]),
                    anuncio.id
                ]
            );

            console.log(
                `✅ Anúncio ${anuncio.id} -> ${imagem}`
            );
        }

        console.log("\n🎉 Todas as imagens foram vinculadas!");

        process.exit();

    } catch (err) {

        console.error(err);

        process.exit(1);

    }
}

popularImagens();