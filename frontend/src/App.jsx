import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [temaEscuro, setTemaEscuro] = useState(() => {
    return localStorage.getItem("tema") === "escuro";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      temaEscuro ? "dark" : "light"
    );

    localStorage.setItem(
      "tema",
      temaEscuro ? "escuro" : "claro"
    );
  }, [temaEscuro]);

  function alternarTema() {
    setTemaEscuro((temaAtual) => !temaAtual);
  }

  return (
    <Dashboard
      temaEscuro={temaEscuro}
      alternarTema={alternarTema}
    />
  );
}

export default App;