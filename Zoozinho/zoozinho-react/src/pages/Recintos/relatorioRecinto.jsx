import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RelatorioGeral from "../Gerais/relatorio";
import { mostrarRelatorioRecinto } from "../../services/recintoService";

export default function RelatorioRecinto() {
  const { id } = useParams();
  const [NomeRecinto, setNomeRecinto] = useState("");

  const fetchData = () =>
    mostrarRelatorioRecinto(id).then((relatorio) => {
      setNomeRecinto(relatorio.NomeRecinto);
      return relatorio;
    });

  return (
    <RelatorioGeral
      fetchData={fetchData}
      titulo={`Relatório ${NomeRecinto}`}
    />
  );
}
