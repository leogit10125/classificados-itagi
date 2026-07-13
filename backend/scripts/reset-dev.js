const fs = require("fs");
const path = require("path");
const db = require("../config/db");

async function reset() {
    try {

        console.log("\n===============================");
        console.log("🧹 RESET DO AMBIENTE");
        console.log("===============================\n");

        // Apagar anúncios
        await db.query("DELETE FROM anuncios");

        console.log("✅ Anúncios removidos.");

        // Reiniciar AUTO_INCREMENT
        await db.query("ALTER TABLE anuncios AUTO_INCREMENT = 1");

        console.log("✅ AUTO_INCREMENT reiniciado.");

        // Pasta de uploads
        const uploads = path.join(__dirname, "../uploads");

        const arquivos = fs.readdirSync(uploads);

        let apagados = 0;

        for (const arquivo of arquivos) {

            const caminho = path.join(uploads, arquivo);

            if (
                fs.statSync(caminho).isFile() &&
                /\.(jpg|jpeg|png|webp|gif)$/i.test(arquivo)
            ) {
                fs.unlinkSync(caminho);
                apagados++;
            }

        }

        console.log(`✅ ${apagados} imagens removidas.`);

        console.log("\n🎉 Ambiente limpo com sucesso!\n");

        process.exit(0);

    } catch (err) {

        console.error(err);
        process.exit(1);

    }
}

reset();