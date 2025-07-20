import React, { useCallback, useMemo } from "react";
import ListaGenerica from "../Gerais/listar";
import CardHabitat from "./cardHabitat";
import { listarHabitats } from "../../services/habitatService";
import { useParams } from "react-router-dom";

export default function ListaHabitat() {
  const { recintoId: recintoIdParam } = useParams();
  const memoizedListarHabitats = useCallback(async (skip, pageSize, termoPesquisa, filtrosExtras) => {
    return await listarHabitats(skip, pageSize, termoPesquisa, filtrosExtras);
  }, []);

  const memoizedFiltrosExtras = useMemo(() => {
    const filters = {};
    if (recintoIdParam) {
      filters.recintoId = parseInt(recintoIdParam);
    }
    return filters;
  }, [recintoIdParam]);

  return (
    <ListaGenerica
      titulo="Habitats Disponíveis"
      buscarDados={memoizedListarHabitats} 
      componenteItem={CardHabitat}
      nomeEntidade="habitats"
      filtrosExtras={memoizedFiltrosExtras} 
    />
  );
}