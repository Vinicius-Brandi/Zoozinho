import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarHabitatPorId, deletarHabitat } from "../../services/habitatService";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";

import CadastroHabitat from "./cadastroHabitat";

import "../Gerais/styles/perfil.css";

export default function PerfilHabitat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habitat, setHabitat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const {
    modalOpen: alertaAberto,
    modalTitle,
    modalMessage,
    showModal,
    closeModal,
  } = useModalAlert();

  const carregarHabitat = () => {
    setLoading(true);
    setErro(null);
    buscarHabitatPorId(id)
      .then((data) => {
        setHabitat(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar o habitat:", error);
        setErro("Erro ao carregar o habitat. Por favor, tente novamente.");
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarHabitat();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletarHabitat(habitat.id);
      showModal("Sucesso", "Habitat excluído com sucesso!");
      setConfirmarExclusao(false);
      navigate("/habitats");
    } catch (errors) {
      if (Array.isArray(errors)) {
        const mensagens = errors.map((e) => `${e.propriedade}: ${e.mensagem}`).join("\n");
        showModal("Erro ao excluir", mensagens);
      } else if (errors.message) {
        showModal("Erro ao excluir", errors.message);
      } else {
        showModal("Erro", "Erro inesperado ao excluir o habitat.");
      }
      setConfirmarExclusao(false);
    }
  };

  const onSuccessCadastro = () => {
    carregarHabitat();
    setModalCadastroAberto(false);
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  if (!habitat) return <p>Habitat não encontrado.</p>;

  return (
    <div className="pagina-detalhes">
      <h1>Detalhes do Habitat: {habitat.nome}</h1>

      <div className="secao-informacoes">
        <p><strong>Espécie Principal:</strong> {habitat.especieNome}</p>
        <p><strong>Recinto:</strong> {habitat.recintoNome}</p>
        <p><strong>Capacidade Máxima:</strong> {habitat.maxCapacidade}</p>

        {habitat.animaisNomes && habitat.animaisNomes.length > 0 && (
          <p><strong>Animais Atuais:</strong> {habitat.animaisNomes.join(", ")}</p>
        )}
      </div>

      <div className="button-group">
        <button onClick={() => setModalCadastroAberto(true)}>
          Editar Habitat
        </button>
        <button
          onClick={() => setConfirmarExclusao(true)}
          className="button-delete"
        >
          Excluir Habitat
        </button>
        <button
          onClick={() => navigate(`/habitats/${id}/animais`)}
          className="button-secondary-action"
        >
          Ver Animais deste Habitat
        </button>
      </div>
      {modalCadastroAberto && (
        <div className="modal-overlay"> 
          <div className="modal-dialog">
            <CadastroHabitat
              id={habitat.id}
              onClose={() => setModalCadastroAberto(false)}
              onSuccess={onSuccessCadastro}
            />
          </div>
        </div>
      )}
      {confirmarExclusao && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o habitat "{habitat.nome}"?</p>
            <div className="modal-button-group">
              <button onClick={handleDelete} className="button-confirm">
                Sim, excluir
              </button>
              <button
                onClick={() => setConfirmarExclusao(false)}
                className="button-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <ModalAlert
        open={alertaAberto}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
}
