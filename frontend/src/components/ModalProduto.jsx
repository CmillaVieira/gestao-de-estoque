import { useEffect, useState } from "react";
import { FiPackage, FiSave, FiX } from "react-icons/fi";

const estadoInicial = {
  nome: "",
  codigo: "",
  categoria: "",
  marca: "",
  preco: "",
  quantidade: "",
  estoque_minimo: "",
  descricao: "",
  ativo: true,
};

function ModalProduto({
  aberto,
  fecharModal,
  salvarProduto,
  salvando,
  erroFormulario,
  produtoEditando,
  modoEdicao,
}) {
  const [formulario, setFormulario] = useState(estadoInicial);

  useEffect(() => {
  if (!aberto) return;

  if (modoEdicao && produtoEditando) {
    setFormulario({
      nome: produtoEditando.nome || "",
      codigo: produtoEditando.codigo || "",
      categoria: produtoEditando.categoria || "",
      marca: produtoEditando.marca || "",
      preco: produtoEditando.preco || "",
      quantidade: produtoEditando.quantidade || "",
      estoque_minimo:
        produtoEditando.estoque_minimo || "",
      descricao: produtoEditando.descricao || "",
      ativo: produtoEditando.ativo,
    });

    return;
  }

  setFormulario(estadoInicial);
}, [aberto, modoEdicao, produtoEditando]);

  if (!aberto) {
    return null;
  }

  function atualizarCampo(event) {
    const { name, value, type, checked } = event.target;

    setFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function enviarFormulario(event) {
    event.preventDefault();

    const produto = {
      ...formulario,
      preco: Number(formulario.preco),
      quantidade: Number(formulario.quantidade || 0),
      estoque_minimo: Number(formulario.estoque_minimo || 5),
    };

    await salvarProduto(produto);
  }

  return (
    <div className="modal-overlay" onMouseDown={fecharModal}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-produto-titulo"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <form onSubmit={enviarFormulario}>
          <div className="modal-header">
            <div className="modal-title-group">
              <div className="modal-icon">
                <FiPackage />
              </div>

              <div>
                <h2 id="modal-produto-titulo">
  {modoEdicao ? "Editar Produto" : "Novo Produto"}
</h2>

<p>
  {modoEdicao
    ? "Atualize as informações do produto."
    : "Preencha os dados para cadastrar um produto."}
</p>
              </div>
            </div>

            <button
              className="modal-close-button"
              type="button"
              onClick={fecharModal}
              aria-label="Fechar modal"
              title="Fechar"
              disabled={salvando}
            >
              <FiX />
            </button>
          </div>

          <div className="modal-body">
            {erroFormulario && (
              <div className="form-error-message">
                {erroFormulario}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="nome">Nome do produto</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Notebook Lenovo"
                  required
                  disabled={salvando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input
                  id="codigo"
                  name="codigo"
                  type="text"
                  value={formulario.codigo}
                  onChange={atualizarCampo}
                  placeholder="Ex.: NB001"
                  required
                  disabled={salvando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoria">Categoria</label>
                <input
                  id="categoria"
                  name="categoria"
                  type="text"
                  value={formulario.categoria}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Eletrônicos"
                  required
                  disabled={salvando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  value={formulario.marca}
                  onChange={atualizarCampo}
                  placeholder="Ex.: Lenovo"
                  disabled={salvando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="preco">Preço</label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formulario.preco}
                  onChange={atualizarCampo}
                  placeholder="0,00"
                  required
                  disabled={salvando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="0"
                  value={formulario.quantidade}
                  onChange={atualizarCampo}
                  placeholder="0"
                  disabled={salvando}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estoque_minimo">Estoque mínimo</label>
                <input
                  id="estoque_minimo"
                  name="estoque_minimo"
                  type="number"
                  min="0"
                  value={formulario.estoque_minimo}
                  onChange={atualizarCampo}
                  placeholder="5"
                  disabled={salvando}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formulario.descricao}
                  onChange={atualizarCampo}
                  placeholder="Digite uma descrição para o produto..."
                  rows="4"
                  disabled={salvando}
                />
              </div>

              <label className="status-checkbox form-group-full">
                <input
                  name="ativo"
                  type="checkbox"
                  checked={formulario.ativo}
                  onChange={atualizarCampo}
                  disabled={salvando}
                />

                <span>
                  <strong>Produto ativo</strong>
                  <small>O produto ficará disponível no sistema.</small>
                </span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="modal-cancel-button"
              type="button"
              onClick={fecharModal}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              className="modal-save-button"
              type="submit"
              disabled={salvando}
            >
              <FiSave />
              {salvando
                ? "Salvando..."
                : modoEdicao
                ? "Atualizar Produto"
                : "Salvar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalProduto;