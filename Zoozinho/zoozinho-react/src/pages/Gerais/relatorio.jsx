import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./styles/relatorio.css"

const cores = [
  "#264653", "#2a9d8f", "#e9c46a", "#f4a261",
  "#e76f51", "#6a4c93", "#457b9d",
];

export default function RelatorioGeral({ fetchData, titulo, subTitulo }) {
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [removidas, setRemovidas] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData()
      .then((relatorio) => {
        if (relatorio.especies) {
          setDadosOriginais(relatorio.especies);
        } else {
          setDadosOriginais(relatorio);
        }
        setErro(false);
      })
      .catch(() => {
        setErro(true);
        setDadosOriginais([]);
      })
      .finally(() => setLoading(false));
  }, [fetchData]);

  const dadosAtivos = dadosOriginais.filter((e) => !removidas[e.especieId]);
  const totalAnimais = dadosAtivos.reduce((acc, e) => acc + e.quantidade, 0);

  function toggleRemover(id) {
    setRemovidas((old) => ({
      ...old,
      [id]: !old[id],
    }));
  }

  if (loading) return <p>Carregando relatório...</p>;
  if (erro) return <p style={{ color: "red" }}>Erro ao carregar relatório.</p>;

  return (
    <div className="relatorio-container">
      {(titulo || subTitulo) && (
        <div className="relatorio-info">
          {titulo && <h1>{titulo}</h1>}
          {subTitulo && <h3>{subTitulo}</h3>}
        </div>
      )}

      <div className="relatorio-box lista">
        <h2>Total de Animais: {totalAnimais}</h2>
        <ul className="lista-especies">
          {dadosOriginais.map(({ especieId, especieNome, quantidade }, i) => {
            const removida = removidas[especieId];
            return (
              <li
                key={especieId}
                onClick={() => toggleRemover(especieId)}
                className={`item-especie ${removida ? "removida" : ""}`}
                style={{ "--cor": cores[i % cores.length] }}
              >
                <div className="quadrado-cor"></div>
                {especieNome} - {quantidade}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relatorio-box grafico">
        <h2>Distribuição de Espécies</h2>
        {dadosAtivos.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={dadosAtivos}
                dataKey="quantidade"
                nameKey="especieNome"
                cx="50%"
                cy="40%"
                outerRadius={100}
                label={({ payload, percent }) =>
                  `${payload.especieNome} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                isAnimationActive={true}
                animationDuration={400}
              >
                {dadosAtivos.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} animais`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Nenhuma espécie selecionada para o gráfico.</p>
        )}
      </div>
    </div>
  );
}