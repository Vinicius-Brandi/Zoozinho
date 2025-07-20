import React, { useCallback, useMemo } from "react";
import ListaGenerica from "../Gerais/listar";
import CardRecinto from "./cardRecinto";
import { listarRecintos } from "../../services/recintoService";

export default function ListaRecinto() {
  const memoizedListarRecintos = useCallback(async (skip, pageSize, termoPesquisa, filtrosExtras) => {
    return await listarRecintos(skip, pageSize, termoPesquisa, filtrosExtras);
  }, []);

  const memoizedFiltrosExtras = useMemo(() => {
    return {};
  }, []);

  return (
    <ListaGenerica
      titulo="Recintos Disponíveis"
      buscarDados={memoizedListarRecintos} 
      componenteItem={CardRecinto}
      nomeEntidade="recintos"
      filtrosExtras={memoizedFiltrosExtras} 
    />
  );
}