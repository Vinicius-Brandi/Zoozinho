import { listarRecintos } from "../../services";
import ListaGenerica from "../Gerais/listar";
import RecintoCard from "./cardRecinto";

export default function ListaRecinto() {
  return (
    <ListaGenerica
      titulo="Recintos disponiveis"
      buscarDados={listarRecintos}
      componenteItem={RecintoCard}
      nomeEntidade="recintos"
    />
  );
}
