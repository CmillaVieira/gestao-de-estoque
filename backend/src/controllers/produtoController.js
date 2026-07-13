const pool = require("../database/connection");

// Listar todos os produtos
const listarProdutos = async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM produtos ORDER BY id DESC"
    );

    res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);

    res.status(500).json({
      mensagem: "Erro ao listar produtos.",
    });
  }
};

// Cadastrar um novo produto
const cadastrarProduto = async (req, res) => {
  try {
    const {
      nome,
      codigo,
      categoria,
      marca,
      descricao,
      preco,
      quantidade,
      estoque_minimo,
      ativo,
    } = req.body;

    if (!nome || !codigo || !categoria || preco === undefined) {
      return res.status(400).json({
        mensagem:
          "Nome, código, categoria e preço são obrigatórios.",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO produtos
      (
        nome,
        codigo,
        categoria,
        marca,
        descricao,
        preco,
        quantidade,
        estoque_minimo,
        ativo
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        nome,
        codigo,
        categoria,
        marca || null,
        descricao || null,
        preco,
        quantidade || 0,
        estoque_minimo || 5,
        ativo ?? true,
      ]
    );

    res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      produto: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar produto.",
    });
  }
};

// Buscar produto por ID
const buscarProdutoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "SELECT * FROM produtos WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado.",
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar produto:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar produto.",
    });
  }
};

// Atualizar produto
const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nome,
      codigo,
      categoria,
      marca,
      descricao,
      preco,
      quantidade,
      estoque_minimo,
      ativo,
    } = req.body;

    if (!nome || !codigo || !categoria || preco === undefined) {
      return res.status(400).json({
        mensagem:
          "Nome, código, categoria e preço são obrigatórios.",
      });
    }

    const resultado = await pool.query(
      `
      UPDATE produtos
      SET
        nome = $1,
        codigo = $2,
        categoria = $3,
        marca = $4,
        descricao = $5,
        preco = $6,
        quantidade = $7,
        estoque_minimo = $8,
        ativo = $9,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
      `,
      [
        nome.trim(),
        codigo.trim().toUpperCase(),
        categoria.trim(),
        marca?.trim() || null,
        descricao?.trim() || null,
        Number(preco),
        Number(quantidade ?? 0),
        Number(estoque_minimo ?? 5),
        ativo ?? true,
        id,
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado.",
      });
    }

    res.status(200).json({
      mensagem: "Produto atualizado com sucesso!",
      produto: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);

    if (erro.code === "23505") {
      return res.status(409).json({
        mensagem: "Já existe um produto com esse código.",
      });
    }

    if (erro.code === "23514") {
      return res.status(400).json({
        mensagem:
          "Preço, quantidade e estoque mínimo não podem ser negativos.",
      });
    }

    res.status(500).json({
      mensagem: "Erro ao atualizar produto.",
    });
  }
};

// Excluir produto
const excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado.",
      });
    }

    res.status(200).json({
      mensagem: "Produto excluído com sucesso!",
      produto: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);

    res.status(500).json({
      mensagem: "Erro ao excluir produto.",
    });
  }
};

module.exports = {
  listarProdutos,
  cadastrarProduto,
  buscarProdutoPorId,
  atualizarProduto,
  excluirProduto,
};