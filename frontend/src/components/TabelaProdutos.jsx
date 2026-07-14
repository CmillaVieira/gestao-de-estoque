import {
  FiAlertCircle,
  FiEdit2,
  FiPackage,
  FiTrash2,
} from "react-icons/fi";

function TabelaProdutos({
  produtos,
  carregando,
  erro,
  editarProduto,
  excluirProduto,
}) {
  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(valor || 0));

  function obterSituacaoEstoque(produto) {
    const quantidade = Number(produto.quantidade || 0);
    const estoqueMinimo = Number(produto.estoque_minimo || 0);

    if (quantidade === 0) {
      return {
        texto: "Sem estoque",
        classe: "stock-empty",
      };
    }

    if (quantidade <= estoqueMinimo) {
      return {
        texto: "Estoque baixo",
        classe: "stock-low",
      };
    }

    return {
      texto: "Em estoque",
      classe: "stock-ok",
    };
  }

  return (
    <section className="products-panel">
      <div className="products-panel-header">
        <div>
          <span className="section-label">Produtos</span>
          <h3>Lista de produtos</h3>
          <p>Visualize e gerencie os produtos cadastrados.</p>
        </div>

        <span className="products-count">
          {produtos.length}{" "}
          {produtos.length === 1 ? "produto" : "produtos"}
        </span>
      </div>

      {carregando && (
        <div className="loading-state">
          <span className="loading-spinner" />
          <p>Carregando produtos...</p>
        </div>
      )}

      {!carregando && erro && (
        <div className="empty-state error-state">
          <div className="empty-state-icon">
            <FiAlertCircle />
          </div>

          <h4>Não foi possível carregar os produtos</h4>
          <p>{erro}</p>
        </div>
      )}

      {!carregando && !erro && produtos.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiPackage />
          </div>

          <h4>Nenhum produto encontrado</h4>

          <p>
            Cadastre seu primeiro produto para começar a organizar o estoque.
          </p>
        </div>
      )}

      {!carregando && !erro && produtos.length > 0 && (
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Situação</th>
                <th className="actions-column">Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((produto) => {
                const situacao = obterSituacaoEstoque(produto);

                return (
                  <tr key={produto.id}>
                    <td>
                      <span className="product-code">
                        {produto.codigo}
                      </span>
                    </td>

                    <td>
                      <div className="product-info">
                        <strong>{produto.nome}</strong>
                        <span>{produto.marca || "Sem marca"}</span>
                      </div>
                    </td>

                    <td>{produto.categoria}</td>

                    <td className="price-cell">
                      {formatarMoeda(produto.preco)}
                    </td>

                    <td>{produto.quantidade}</td>

                    <td>
                      <span className={`stock-badge ${situacao.classe}`}>
                        {situacao.texto}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="action-button edit-button"
                          type="button"
                          title="Editar produto"
                          aria-label={`Editar ${produto.nome}`}
                          onClick={() => editarProduto(produto)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="action-button delete-button"
                          type="button"
                          title="Excluir produto"
                          aria-label={`Excluir ${produto.nome}`}
                          onClick={() => excluirProduto(produto)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TabelaProdutos;