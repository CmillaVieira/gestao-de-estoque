const express = require("express");
const cors = require("cors");
require("dotenv").config();

const produtoRoutes = require("./src/routes/produtoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "API Gestão de Estoque funcionando!",
  });
});

app.use("/produtos", produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});