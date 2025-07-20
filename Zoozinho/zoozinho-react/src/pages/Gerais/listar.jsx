import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/listagem.css";

export default function ListaGenerica({
  titulo,
  buscarDados,
  componenteItem: ComponenteItem,
  nomeEntidade,
  filtrosExtras = {}
}) {
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [pagina, setPagina] = useState(0);
  const pageSize = 6;
  const totalPaginas = Math.ceil(total / pageSize);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const skip = pagina * pageSize;
      const resultado = await buscarDados(skip, pageSize, termoPesquisa, filtrosExtras);
      setItens(resultado.itens || []);
      setTotal(resultado.total || 0);
    } catch (error) {
      setErro(`Erro ao carregar ${titulo.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [pagina, filtrosExtras, buscarDados, termoPesquisa, pageSize]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    if (termoPesquisa !== "" || pagina !== 0) {
      setPagina(prevPagina => {
        if (prevPagina !== 0) {
          return 0;
        }
        return prevPagina;
      });
    }
  }, [termoPesquisa]);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 0 && novaPagina < totalPaginas) {
      setPagina(novaPagina);
    }
  };

  return (
    <div className="lista-container-geral">
      <div className="lista-sidebar">
        <h2>{titulo}</h2>
        <div className="caixa-pesquisa">
          <input
            type="text"
            placeholder={`Pesquisar ${nomeEntidade}...`}
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
      </div>

      <div className="lista-conteudo-principal">
        {loading && <p>Carregando...</p>}
        {erro && <p className="erro">{erro}</p>}
        {!loading && !erro && itens.length === 0 && <p>Nenhum item encontrado.</p>}

        <div className="lista-grid">
          {itens.map((item) => (
            <div key={item.id}>
              <ComponenteItem item={item} />
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <div className="controle-pagina">
            <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina === 0}>
              ◀
            </button>
            <span>
              Página {pagina + 1} de {totalPaginas}
            </span>
            <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina + 1 >= totalPaginas}>
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}