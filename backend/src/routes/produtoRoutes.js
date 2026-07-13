const express = require("express");

const router = express.Router();

const {
  listarProdutos,
  cadastrarProduto,
  buscarProdutoPorId,
  atualizarProduto,
  excluirProduto,
} = require("../controllers/produtoController");

router.get("/", listarProdutos);
router.get("/:id", buscarProdutoPorId);
router.post("/", cadastrarProduto);
router.put("/:id", atualizarProduto);
router.delete("/:id", excluirProduto);

module.exports = router;