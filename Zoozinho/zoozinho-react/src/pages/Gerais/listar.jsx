import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./styles/listagem.css";

export default function ListaGenerica({
  titulo,
  buscarDados,        // função async(skip, take) que retorna { total, itens }
  componenteItem: ComponenteItem,  // componente React para renderizar cada item da lista
  nomeEntidade        // string para construir rota de clique, ex: "animais"
}) {
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [transicao, setTransicao] = useState("in");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pagina = parseInt(searchParams.get("pagina") || "0");
  const pageSize = 6;
  const totalPaginas = Math.ceil(total / pageSize);

  const carregarDados = async (paginaAtual) => {
    setLoading(true);
    setErro(null);
    try {
      const skip = paginaAtual * pageSize;
      const resultado = await buscarDados(skip, pageSize);
      setItens(resultado.itens || []);
      setTotal(resultado.total || 0);
    } catch {
      setErro(`Erro ao carregar ${titulo.toLowerCase()}.`);
    }
    setLoading(false);
  };

  useEffect(() => {
    setTransicao("out");
    const timeout = setTimeout(() => {
      carregarDados(pagina);
      setTransicao("in");
    }, 300);

    return () => clearTimeout(timeout);
  }, [pagina]);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 0 && novaPagina < totalPaginas) {
      setSearchParams({ pagina: novaPagina });
    }
  };

  const handleClickItem = (id) => {
    if (nomeEntidade) {
      navigate(`/${nomeEntidade}/perfil/${id}`);
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
        <h2>{titulo}</h2>

        {loading && <p>Carregando...</p>}
        {erro && <p className="erro">{erro}</p>}
        {!loading && !erro && itens.length === 0 && <p>Nenhum item encontrado.</p>}

        <div className="lista-grid">
          {itens.map((item) => (
            <div key={item.id} onClick={() => handleClickItem(item.id)}>
              <ComponenteItem item={item} />
            </div>
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
