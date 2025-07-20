import React, { useCallback, useMemo } from "react";
import ListaGenerica from "../Gerais/listar";
import AnimalCard from "./cardAnimal";
import { listarAnimais } from "../../services/animalService";
import { useParams } from "react-router-dom";

export default function ListaAnimais() {
  const { habitatId, especieId } = useParams();

  const memoizedListarAnimais = useCallback(
    async (skip, pageSize, termoPesquisa, filtrosExtras) => {
      return await listarAnimais(skip, pageSize, termoPesquisa, filtrosExtras);
    },
    []
  );

  const memoizedFiltrosExtras = useMemo(() => {
    const filtros = {};
    if (especieId) {
      filtros.especieId = parseInt(especieId);
    }
    if (habitatId) {
      filtros.habitatId = parseInt(habitatId);
    }
    return filtros;
  }, [especieId, habitatId]);

  return (
    <ListaGenerica
      titulo="Animais"
      buscarDados={memoizedListarAnimais}
      componenteItem={AnimalCard}
      nomeEntidade="animais"
      filtrosExtras={memoizedFiltrosExtras}
    />
  );
}
