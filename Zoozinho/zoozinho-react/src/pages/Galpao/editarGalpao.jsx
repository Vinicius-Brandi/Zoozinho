import { useEffect, useState } from "react";
import { mostrarGalpao, atualizarGalpao } from "../../services/galpaoService";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import "../Gerais/styles/cadastros.css"

export default function EditarGalpao({ onSuccess, onClose }) {
  const [galpao, setGalpao] = useState(null);
  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();

  useEffect(() => {
    mostrarGalpao()
      .then(setGalpao)
      .catch(() => showModal("Erro", "Não foi possível carregar os dados do galpão."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const capacidadeMaxima = parseInt(form.get("capacidadeMaxima"));

    if (isNaN(capacidadeMaxima) || capacidadeMaxima <= 0) {
      showModal("Erro de validação", "Capacidade máxima deve ser um número inteiro positivo.");
      return;
    }

    try {
      await atualizarGalpao({ capacidadeMaxima });
      showModal("Sucesso", "Galpão atualizado com sucesso.");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (errors) {
      const mensagens = errors.map(err => `${err.propriedade}: ${err.mensagem}`).join("\n");
      showModal("Erro ao salvar", mensagens);
    }
  };

  if (!galpao) return <p>Carregando dados do galpão...</p>;

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Atualizar Galpão</h2>

        <div className="form-group">
          <label>Nome do Galpão:</label>
          <p><strong>{galpao.nome || "Nome não disponível"}</strong></p>
        </div>

        <div className="form-group">
          <label>Capacidade Máxima:</label>
          <input
            type="number"
            name="capacidadeMaxima"
            defaultValue={galpao.capacidadeMaxima}
            min={1}
            required
            className="form-input"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="button-submit">Atualizar</button>
          {onClose && (
            <button type="button" onClick={onClose} className="button-reset">Cancelar</button>
          )}
        </div>
      </form>

      <ModalAlert
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </>
  );
}
