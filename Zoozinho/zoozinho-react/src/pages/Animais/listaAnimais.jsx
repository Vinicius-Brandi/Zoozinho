import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnimalCard from "./cardAnimal";
import { listarAnimais } from "../../services";
import "./styles/listaAnimais.css";

export default function ListaAnimais() {
  const [animais, setAnimais] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [transicao, setTransicao] = useState("in");

  const [searchParams, setSearchParams] = useSearchParams();
  const pagina = parseInt(searchParams.get("pagina") || "0");
  const pageSize = 6;

  const totalPaginas = Math.ceil(total / pageSize);

  const carregarAnimais = async (paginaAtual) => {
    setLoading(true);
    setErro(null);
    try {
      const skip = paginaAtual * pageSize;
      const { total, itens } = await listarAnimais(skip, pageSize);
      setAnimais(itens);
      setTotal(total);
    } catch {
      setErro("Erro ao carregar animais.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setTransicao("out");
    const timeout = setTimeout(() => {
      carregarAnimais(pagina);
      setTransicao("in");
    }, 300);

    return () => clearTimeout(timeout);
  }, [pagina]);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 0 && novaPagina < totalPaginas) {
      setSearchParams({ pagina: novaPagina });
    }
  };

  return (
    <div className="lista-container">
      <button
        className="seta-lateral esquerda"
        onClick={() => mudarPagina(pagina - 1)}
        disabled={pagina === 0}
      >
        ◀
      </button>

      <div className={`lista-centro transicao-${transicao}`}>
        <h2>Lista de Animais</h2>
        {loading && <p>Carregando...</p>}
        {erro && <p className="erro">{erro}</p>}
        {!loading && !erro && animais.length === 0 && <p>Nenhum animal encontrado.</p>}

        <div className="lista-grid">
          {animais.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>

        <div className="controle-pagina">
          <span>Página:</span>
          <select
            value={pagina}
            onChange={(e) => mudarPagina(parseInt(e.target.value))}
          >
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <option key={i} value={i}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="seta-lateral direita"
        onClick={() => mudarPagina(pagina + 1)}
        disabled={(pagina + 1) >= totalPaginas}
      >
        ▶
      </button>
    </div>
  );
}
