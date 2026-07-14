import { FiPlus, FiSearch } from "react-icons/fi";

function BarraPesquisa({
  pesquisa,
  alterarPesquisa,
  abrirModalProduto,
}) {
  return (
    <section className="products-toolbar">
      <div className="search-wrapper">
        <FiSearch className="search-icon" />

        <input
          type="search"
          value={pesquisa}
          onChange={(event) => alterarPesquisa(event.target.value)}
          placeholder="Pesquisar por nome, código ou categoria..."
          aria-label="Pesquisar produtos"
        />
      </div>

      <button
        className="new-product-button"
        type="button"
        onClick={abrirModalProduto}
      >
        <FiPlus />
        Novo produto
      </button>
    </section>
  );
}

export default BarraPesquisa;