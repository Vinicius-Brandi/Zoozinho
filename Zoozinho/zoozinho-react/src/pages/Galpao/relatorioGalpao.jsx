import React from "react";
import RelatorioGeral from "../Gerais/relatorio";
import { mostrarRelatorioGalpao } from "../../services/galpaoService";

export default function RelatorioGalpao() {
  return (
    <RelatorioGeral
      fetchData={mostrarRelatorioGalpao}
      titulo="Relatório do Galpão"
    />
  );
}
