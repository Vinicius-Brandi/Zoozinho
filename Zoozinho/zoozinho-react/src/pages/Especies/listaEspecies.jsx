import React, { useCallback, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ListaGenerica from "../Gerais/listar";
import EspecieCard from "./cardEspecie";
import { listarEspecies } from "../../services/especieService";

export default function ListaEspecies() {
  const [searchParams] = useSearchParams();
  const { categoriaId: paramCategoriaId } = useParams();
  const categoriaIdToFilter = paramCategoriaId; 

  const memoizedListarEspecies = useCallback(
    async (skip, pageSize, termoPesquisa, filtrosExtras) => {
      return await listarEspecies(skip, pageSize, termoPesquisa, filtrosExtras);
    },
    []
  );

  const memoizedFiltrosExtras = useMemo(() => {
    const filtros = {};
    if (categoriaIdToFilter) {
      filtros.categoriaId = parseInt(categoriaIdToFilter); 
    }
    return filtros;
  }, [categoriaIdToFilter]); 

  return (
    <ListaGenerica
      titulo="Espécies"
      buscarDados={memoizedListarEspecies}
      componenteItem={EspecieCard}
      nomeEntidade="especies"
      filtrosExtras={memoizedFiltrosExtras}
    />
  );
}