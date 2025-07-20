import React, { useCallback, useMemo } from "react";
import ListaGenerica from "../Gerais/listar";
import CategoriaCard from "./cardCategoria";
import { listarCategorias } from "../../services/categoriaService";

export default function ListaCategorias() {
  const memoizedListarCategorias = useCallback(
    async (skip, pageSize, termoPesquisa, filtrosExtras) => {
      return await listarCategorias(skip, pageSize, termoPesquisa, filtrosExtras);
    },
    []
  );

  const memoizedFiltrosExtras = useMemo(() => {
    const filtros = {};
    return filtros;
  }, []);

  return (
    <ListaGenerica
      titulo="Categorias"
      buscarDados={memoizedListarCategorias}
      componenteItem={CategoriaCard}
      nomeEntidade="categorias"
      filtrosExtras={memoizedFiltrosExtras}
    />
  );
}