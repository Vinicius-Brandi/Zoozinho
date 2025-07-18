import { listarAnimais } from "../../services";
import AnimalCard from "./cardAnimal";
import ListaGenerica from "../Gerais/listar";

export default function ListaAnimais() {
  return (
    <ListaGenerica
      titulo="Lista de Animais"
      buscarDados={listarAnimais}
      componenteItem={AnimalCard}
      nomeEntidade="animal"
    />
  );
}
