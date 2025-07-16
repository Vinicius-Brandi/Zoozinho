import { useEffect, useState } from "react";
import { listarMovimentacoes } from "../../services";
import "./styles/movimentacao.css";

export default function ListaMovimentacoes({ animalId, reloadKey }) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!animalId) return;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);
        const data = await listarMovimentacoes(animalId);
        setMovimentacoes(data);
      } catch {
        setErro("Erro ao carregar movimentações.");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [animalId, reloadKey]);

  if (loading) return <p>Carregando movimentações...</p>;
  if (erro) return <p>{erro}</p>;
  if (movimentacoes.length === 0) return <p>Nenhuma movimentação encontrada.</p>;

  return (
    <div className="lista-movimentacoes">
      <h2>Movimentações</h2>
      <table>
        <thead>
          <tr>
            <th>Data/Hora</th>
            <th>Origem</th>
            <th>Destino</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((movimentacao) => (
            <LinhaMovimentacao key={movimentacao.id} movimentacao={movimentacao} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LinhaMovimentacao({ movimentacao }) {
  return (
    <tr>
      <td>{new Date(movimentacao.dataHora).toLocaleString()}</td>
      <td>{movimentacao.origemHabitatNome || movimentacao.origemGalpaoNome || "Sem origem"}</td>
      <td>{movimentacao.destinoHabitatNome || movimentacao.destinoGalpaoNome || "Sem destino"}</td>
    </tr>
  );
}
