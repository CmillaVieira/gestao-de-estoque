import { useEffect, useMemo, useState } from "react";

import BarraPesquisa from "../components/BarraPesquisa";
import DashboardCards from "../components/DashboardCards";
import Header from "../components/Header";
import ModalProduto from "../components/ModalProduto";
import TabelaProdutos from "../components/TabelaProdutos";

import api from "../services/api";

function Dashboard({ temaEscuro, alternarTema }) {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [servidorConectado, setServidorConectado] = useState(false);
  const [verificandoServidor, setVerificandoServidor] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [salvandoProduto, setSalvandoProduto] = useState(false);
  const [erroFormulario, setErroFormulario] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [excluindoProduto, setExcluindoProduto] = useState(false);

  async function carregarProdutos() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await api.get("/produtos");

      setProdutos(resposta.data);
      setServidorConectado(true);
    } catch (erroRequisicao) {
      console.error("Erro ao carregar produtos:", erroRequisicao);

      setErro(
        "Confira se o backend e o PostgreSQL estão funcionando."
      );

      setServidorConectado(false);
    } finally {
      setCarregando(false);
      setVerificandoServidor(false);
    }
  }

  useEffect(() => {
    carregarProdutos();

    const intervalo = setInterval(async () => {
      try {
        await api.get("/");
        setServidorConectado(true);
      } catch (erroRequisicao) {
        console.error(
          "Erro ao verificar servidor:",
          erroRequisicao
        );

        setServidorConectado(false);
      } finally {
        setVerificandoServidor(false);
      }
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  const produtosFiltrados = useMemo(() => {
    const textoPesquisa = pesquisa.trim().toLowerCase();

    if (!textoPesquisa) {
      return produtos;
    }

    return produtos.filter((produto) => {
      const nome = produto.nome?.toLowerCase() || "";
      const codigo = produto.codigo?.toLowerCase() || "";
      const categoria = produto.categoria?.toLowerCase() || "";
      const marca = produto.marca?.toLowerCase() || "";

      return (
        nome.includes(textoPesquisa) ||
        codigo.includes(textoPesquisa) ||
        categoria.includes(textoPesquisa) ||
        marca.includes(textoPesquisa)
      );
    });
  }, [pesquisa, produtos]);

  function obterTextoStatus() {
    if (verificandoServidor) {
      return "Verificando servidor...";
    }

    return servidorConectado
      ? "Servidor Conectado"
      : "Servidor Desconectado";
  }

  function mostrarMensagemSucesso(mensagem) {
    setMensagemSucesso(mensagem);

    setTimeout(() => {
      setMensagemSucesso("");
    }, 3500);
  }

  function abrirModalProduto() {
    setModoEdicao(false);
    setProdutoEditando(null);
    setErroFormulario("");
    setModalAberto(true);
  }

  function editarProduto(produto) {
    setModoEdicao(true);
    setProdutoEditando(produto);
    setErroFormulario("");
    setModalAberto(true);
  }

  function fecharModalProduto() {
    if (salvandoProduto) {
      return;
    }

    setErroFormulario("");
    setModalAberto(false);
    setProdutoEditando(null);
    setModoEdicao(false);
  }

  async function salvarProduto(dadosProduto) {
    try {
      setSalvandoProduto(true);
      setErroFormulario("");

      if (modoEdicao && produtoEditando) {
        await api.put(
          `/produtos/${produtoEditando.id}`,
          dadosProduto
        );

        mostrarMensagemSucesso(
          "Produto atualizado com sucesso!"
        );
      } else {
        await api.post("/produtos", dadosProduto);

        mostrarMensagemSucesso(
          "Produto cadastrado com sucesso!"
        );
      }

      await carregarProdutos();

      setModalAberto(false);
      setProdutoEditando(null);
      setModoEdicao(false);
    } catch (erroRequisicao) {
      console.error(
        "Erro ao salvar produto:",
        erroRequisicao
      );

      const mensagemApi =
        erroRequisicao.response?.data?.mensagem ||
        "Não foi possível salvar o produto.";

      setErroFormulario(mensagemApi);
    } finally {
      setSalvandoProduto(false);
    }
  }

  function abrirModalExcluir(produto) {
    setProdutoExcluir(produto);
    setModalExcluirAberto(true);
  }

  function fecharModalExcluir() {
    if (excluindoProduto) {
      return;
    }

    setProdutoExcluir(null);
    setModalExcluirAberto(false);
  }

  async function confirmarExclusaoProduto() {
    if (!produtoExcluir) {
      return;
    }

    try {
      setExcluindoProduto(true);

      await api.delete(`/produtos/${produtoExcluir.id}`);
      await carregarProdutos();

      mostrarMensagemSucesso("Produto excluído com sucesso!");

      setProdutoExcluir(null);
      setModalExcluirAberto(false);
    } catch (erroRequisicao) {
      console.error(
        "Erro ao excluir produto:",
        erroRequisicao
      );

      alert(
        erroRequisicao.response?.data?.mensagem ||
          "Não foi possível excluir o produto."
      );
    } finally {
      setExcluindoProduto(false);
    }
  }

  return (
    <div className="dashboard-page">
      <Header
        temaEscuro={temaEscuro}
        alternarTema={alternarTema}
      />

      <main className="dashboard-content">
        <section className="welcome-section">
          <span className="section-label">Dashboard</span>

          <div className="welcome-content">
            <div>
              <h2>
                Bem-vinda ao Sistema de Gestão de Estoque 👋
              </h2>

              <p>
                Organize produtos, acompanhe o estoque e gerencie
                seu negócio com praticidade e segurança.
              </p>
            </div>

            <div
              className={`system-status ${
                servidorConectado
                  ? "status-online"
                  : "status-offline"
              } ${
                verificandoServidor
                  ? "status-checking"
                  : ""
              }`}
            >
              <span className="status-dot" />
              {obterTextoStatus()}
            </div>
          </div>
        </section>

        <DashboardCards produtos={produtos} />

        <section className="products-section">
          <BarraPesquisa
            pesquisa={pesquisa}
            alterarPesquisa={setPesquisa}
            abrirModalProduto={abrirModalProduto}
          />

          <TabelaProdutos
            produtos={produtosFiltrados}
            carregando={carregando}
            erro={erro}
            editarProduto={editarProduto}
            excluirProduto={abrirModalExcluir}
          />
        </section>
      </main>

      {mensagemSucesso && (
        <div className="toast-success">
          {mensagemSucesso}
        </div>
      )}

      <ModalProduto
        aberto={modalAberto}
        fecharModal={fecharModalProduto}
        salvarProduto={salvarProduto}
        salvando={salvandoProduto}
        erroFormulario={erroFormulario}
        produtoEditando={produtoEditando}
        modoEdicao={modoEdicao}
      />

      {modalExcluirAberto && produtoExcluir && (
        <div
          className="modal-overlay"
          onMouseDown={fecharModalExcluir}
        >
          <div
            className="modal-container modal-delete"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-excluir-titulo"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="modal-excluir-titulo">
                  Excluir produto
                </h2>

                <p>Confirme a exclusão deste item.</p>
              </div>
            </div>

            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir o produto{" "}
                <strong>{produtoExcluir.nome}</strong>?
              </p>

              <p className="delete-warning">
                Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="modal-cancel-button"
                type="button"
                onClick={fecharModalExcluir}
                disabled={excluindoProduto}
              >
                Cancelar
              </button>

              <button
                className="delete-confirm-button"
                type="button"
                onClick={confirmarExclusaoProduto}
                disabled={excluindoProduto}
              >
                {excluindoProduto
                  ? "Excluindo..."
                  : "Excluir produto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;