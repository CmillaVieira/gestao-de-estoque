import {
  FiAlertTriangle,
  FiDollarSign,
  FiLayers,
  FiPackage,
} from "react-icons/fi";

function DashboardCards({ produtos }) {
  const totalProdutos = produtos.length;

  const itensEmEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade || 0),
    0
  );

  const produtosEstoqueBaixo = produtos.filter((produto) => {
    const quantidade = Number(produto.quantidade || 0);
    const estoqueMinimo = Number(produto.estoque_minimo || 0);

    return quantidade <= estoqueMinimo;
  }).length;

  const valorTotalEstoque = produtos.reduce((total, produto) => {
    const preco = Number(produto.preco || 0);
    const quantidade = Number(produto.quantidade || 0);

    return total + preco * quantidade;
  }, 0);

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);

  const cards = [
    {
      titulo: "Produtos cadastrados",
      valor: totalProdutos,
      descricao: "Produtos registrados",
      icone: <FiPackage />,
      estilo: "blue",
    },
    {
      titulo: "Itens em estoque",
      valor: itensEmEstoque,
      descricao: "Unidades disponíveis",
      icone: <FiLayers />,
      estilo: "purple",
    },
    {
      titulo: "Estoque baixo",
      valor: produtosEstoqueBaixo,
      descricao: "Precisam de atenção",
      icone: <FiAlertTriangle />,
      estilo: "orange",
    },
    {
      titulo: "Valor total",
      valor: formatarMoeda(valorTotalEstoque),
      descricao: "Valor armazenado",
      icone: <FiDollarSign />,
      estilo: "green",
    },
  ];

  return (
    <section className="dashboard-cards">
      {cards.map((card) => (
        <article
          className={`dashboard-card card-${card.estilo}`}
          key={card.titulo}
        >
          <div className="card-top">
            <div className="card-icon">{card.icone}</div>
            <span className="card-detail">Atualizado agora</span>
          </div>

          <p className="card-label">{card.titulo}</p>
          <strong className="card-value">{card.valor}</strong>
          <span className="card-description">{card.descricao}</span>
        </article>
      ))}
    </section>
  );
}

export default DashboardCards;