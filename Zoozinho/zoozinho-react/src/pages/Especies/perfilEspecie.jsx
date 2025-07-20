import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarEspeciePorId, deletarEspecie } from "../../services/especieService";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import CadastroEspecie from "./cadastroEspecie";
import "../Gerais/styles/perfil.css"

export default function PerfilEspecie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [especie, setEspecie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const {
    modalOpen: alertaAberto,
    modalTitle,
    modalMessage,
    showModal,
    closeModal,
  } = useModalAlert();

  const carregarEspecie = () => {
    setLoading(true);
    setErro(null);
    buscarEspeciePorId(id)
      .then((data) => {
        setEspecie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar a espécie:", error);
        setErro("Erro ao carregar a espécie. Por favor, tente novamente.");
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarEspecie();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletarEspecie(especie.id);
      showModal("Sucesso", "Espécie excluída com sucesso!");
      setConfirmarExclusao(false);
      setTimeout(() => navigate("/especies"), 2000);
    } catch (errors) {
      if (Array.isArray(errors)) {
        const mensagens = errors.map((e) => `${e.propriedade}: ${e.mensagem}`).join("\n");
        showModal("Erro ao excluir", mensagens);
      } else if (errors.message) {
        showModal("Erro ao excluir", errors.message);
      } else {
        showModal("Erro", "Erro inesperado ao excluir a espécie.");
      }
      setConfirmarExclusao(false);
    }
  };
  if (loading) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  if (!especie) return <p>Espécie não encontrada.</p>;

  return (
    <div className="pagina-detalhes">
      <h1>Detalhes da Espécie: {especie.nome}</h1>
      <div className="secao-informacoes">
        <p><strong>Nome Científico:</strong> {especie.nomeCientifico}</p>
        <p><strong>Descrição:</strong> {especie.descricao}</p>
        {especie.animaisNomes && especie.animaisNomes.length > 0 && (
          <p><strong>Animais Registrados:</strong> {especie.animaisNomes.join(", ")}</p>
        )}
      </div>
      <div className="button-group"> 
        <button onClick={() => setModalEditOpen(true)}>
          Editar Espécie
        </button>
        <button
          onClick={() => setConfirmarExclusao(true)}
          className="button-delete"
        >
          Excluir Espécie
        </button>
        <button
          onClick={() => navigate(`/especies/${id}/animais`)}
          className="button-secondary-action"
        >
          Ver Animais desta Espécie
        </button>
      </div>

      {modalEditOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <CadastroEspecie
              id={especie.id}
              onClose={() => setModalEditOpen(false)}
              onSuccess={() => {
                setModalEditOpen(false);
                carregarEspecie();
              }}
            />
          </div>
        </div>
      )}

      {confirmarExclusao && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir a espécie "{especie.nome}"?</p>
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
