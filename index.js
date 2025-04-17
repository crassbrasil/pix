const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// 🔐 Suas chaves da Nexus Tech
const NEXUS_PUBLIC_KEY = "pk_live_FUF01RbBgi0V4BXctjUyLEcqFIDs3d";
const NEXUS_SECRET_KEY = "sk_live_n2DcGrRa4ZpxPmtf3QAHszDhCeT2iYj6J7rs6LwawK";

// Endpoint /pix que gera o Pix
app.post("/pix", async (req, res) => {
  const { valor } = req.body;

  try {
    const response = await axios.post(
      "https://api.nexustech.com.br/pix/checkout",
      {
        valor: valor,
        chave_pix: "sua-chave-pix",
        descricao: "Doação de R$" + valor,
      },
      {
        headers: {
          Authorization: `Bearer ${NEXUS_SECRET_KEY}`,
          "x-api-key": NEXUS_PUBLIC_KEY,
        },
      }
    );

    const dadosPix = response.data;

    res.json({
      qr_code: dadosPix.qr_code,
      copia_cola: dadosPix.copia_cola,
      id: dadosPix.id_transacao,
    });
  } catch (error) {
    console.error("Erro ao gerar Pix:", error.response?.data || error.message);
    res.status(500).json({
      error: "Erro ao gerar Pix",
      details: error.response?.data || error.message,
    });
  }
});

// Inicia o servidor
app.listen(process.env.PORT || 3000, () => {
  console.log("API rodando 🚀");
});
