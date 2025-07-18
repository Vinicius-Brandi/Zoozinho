import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RelatorioGeral from "../Gerais/relatorio";
import { mostrarRelatorioRecinto } from "../../services/recintoService";

export default function RelatorioRecinto() {
  const { id } = useParams();
  const [nomeRecinto, setNomeRecinto] = useState(null);
  const [relatorioData, setRelatorioData] = useState(null);

  useEffect(() => {
    mostrarRelatorioRecinto(id).then((relatorio) => {
      setNomeRecinto(relatorio.nomeRecinto || "Recinto");
      setRelatorioData(relatorio);
    });
  }, [id]);

  if (!relatorioData) {
    return <p>Carregando relatório...</p>;
  }

  return (
    <RelatorioGeral
      fetchData={() => Promise.resolve(relatorioData)}
      titulo={`Relatório de ${nomeRecinto}`}
    />
  );
}
