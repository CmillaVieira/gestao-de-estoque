import { FiMoon, FiSun, FiPackage } from "react-icons/fi";

function Header({ temaEscuro, alternarTema }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <FiPackage />
        </div>

        <div>
          <h1>Gestão de Estoque</h1>
          <p>Controle inteligente de produtos</p>
        </div>
      </div>

      <button
        className="theme-button"
        type="button"
        onClick={alternarTema}
        aria-label={
          temaEscuro ? "Ativar tema claro" : "Ativar tema escuro"
        }
        title={temaEscuro ? "Tema claro" : "Tema escuro"}
      >
        {temaEscuro ? <FiSun /> : <FiMoon />}
      </button>
    </header>
  );
}

export default Header;