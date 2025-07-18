import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarRecintoPorId, deletarRecinto } from "../../services";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import "./styles/perfilRecinto.css";
import RelatorioRecinto from "./relatorioRecinto";

export default function PerfilRecinto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recinto, setRecinto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  const {
    modalOpen: alertaAberto,
    modalTitle,
    modalMessage,
    showModal,
    closeModal,
  } = useModalAlert();

  const carregarRecinto = () => {
    buscarRecintoPorId(id)
      .then((data) => {
        setRecinto(data);
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao carregar o recinto.");
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarRecinto();
  }, [id]);

  const excluirRecinto = async () => {
    try {
      await deletarRecinto(recinto.id);
      showModal("Recinto excluído", "O recinto foi removido com sucesso.");
      setConfirmarExclusao(false);
      setModalOpen(false);
      navigate("/recintos");
    } catch (erros) {
      if (Array.isArray(erros)) {
        const mensagens = erros
          .map((e) => `${e.propriedade}: ${e.mensagem}`)
          .join("\n");
        showModal("Erro ao excluir", mensagens);
      } else {
        showModal("Erro", "Erro inesperado ao excluir o recinto.");
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;
  if (!recinto) return <p>Recinto não encontrado.</p>;

  return (
    <div className="perfil-recinto">
      <h1>Detalhes do {recinto.nome ?? "Nome não disponível"}</h1>

      <p><strong>Categoria:</strong> {recinto.categoriaNome}</p>
      <p><strong>Capacidade Máxima de Habitats:</strong> {recinto.capacidadeMaxHabitats}</p>

      <div className="button-area">
        <button onClick={() => navigate(`/recintos/editar/${recinto.id}`)}>
          Editar Recinto
        </button>

        <button
          onClick={() => setConfirmarExclusao(true)}
          className="botao-excluir"
        >
          Excluir Recinto
        </button>

        <button
          onClick={() => navigate(`/habitats?recintoId=${recinto.id}`)}
          className="botao-ver-habitats"
        >
          Ver Habitats
        </button>
      </div>

      {confirmarExclusao && (
        <div className="modal-background">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este recinto?</p>
            <div className="button-area">
              <button onClick={excluirRecinto} className="button-submit">
                Sim, excluir
              </button>
              <button
                onClick={() => setConfirmarExclusao(false)}
                className="button-reset"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <RelatorioRecinto recintoId={recinto.id} />

      <ModalAlert
        open={alertaAberto}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
}
