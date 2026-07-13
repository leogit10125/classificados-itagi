const db = require("../config/db");

async function popularBanco() {
  try {

    console.log("🚀 Atualizando anúncios...");

    // aqui virão os updates

    console.log("✅ Banco atualizado!");

  } catch (err) {

    console.error(err);

  }

  process.exit();
}

popularBanco();