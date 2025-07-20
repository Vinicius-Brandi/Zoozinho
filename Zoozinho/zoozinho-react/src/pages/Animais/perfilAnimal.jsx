import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarAnimalPorId, deletarAnimal } from "../../services";
import CadastroAnimal from "./cadastroAnimal";
import ListaMovimentacoes from "./movimentacao";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import "../Gerais/styles/perfil.css"

export default function PerfilAnimal() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [reloadMovimentacoes, setReloadMovimentacoes] = useState(0);
  const {
    modalOpen: alertaAberto,
    modalTitle,
    modalMessage,
    showModal,
    closeModal,
  } = useModalAlert();

  const carregarAnimal = () => {
    buscarAnimalPorId(id)
      .then((data) => {
        setAnimal(data);
        setLoading(false);
      })
      .catch(() => {
        setErro("Erro ao carregar o animal.");
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarAnimal();
  }, [id]);

  const excluirAnimal = async () => {
    try {
      await deletarAnimal(animal.id);
      showModal("Animal excluído", "O animal foi removido com sucesso.");
      setConfirmarExclusao(false);
      setModalOpen(false);
    } catch (erros) {
      if (Array.isArray(erros)) {
        const mensagens = erros
          .map((e) => `${e.propriedade}: ${e.mensagem}`)
          .join("\n");
        showModal("Erro ao excluir", mensagens);
      } else {
        showModal("Erro", "Erro inesperado ao excluir o animal.");
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;
  if (!animal) return <p>Animal não encontrado.</p>;

  return (
    <div className="pagina-detalhes">
      <h1>Perfil do Animal: {animal.nome}</h1>

      <div className="secao-informacoes">
        <p>
          <strong>Espécie:</strong> {animal.especieNome}
        </p>
        <p>
          <strong>Idade:</strong> {animal.idade} anos
        </p>
        <p>
          <strong>Peso:</strong> {animal.peso} kg
        </p>
        <p>
          <strong>Sexo:</strong> {animal.sexo}
        </p>
        <p>
          <strong>Alocação:</strong>{" "}
          {animal.habitatNome || animal.galpaoNome || "Não alocado"}
        </p>
      </div>

      <div className="button-group">
        <button onClick={() => setModalOpen(true)}>Editar Animal</button>
        <button onClick={() => setConfirmarExclusao(true)} className="button-delete">
          Excluir Animal
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <CadastroAnimal
              animalId={id}
              onClose={() => setModalOpen(false)}
              onSuccess={() => {
                setModalOpen(false);
                carregarAnimal();
                setReloadMovimentacoes((prev) => prev + 1);
              }}
            />
          </div>
        </div>
      )}

      {confirmarExclusao && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este animal?</p>
            <div className="modal-button-group">
              <button onClick={excluirAnimal} className="button-confirm">
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

      <ListaMovimentacoes animalId={animal.id} reloadKey={reloadMovimentacoes} />

      <ModalAlert
        open={alertaAberto}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
}
