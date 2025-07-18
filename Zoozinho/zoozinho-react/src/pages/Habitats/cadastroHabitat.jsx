import { useEffect, useState } from "react";
import {
  buscarHabitatPorId,
  cadastrarHabitat,
  atualizarHabitat,
  listarRecintos,
  listarEspecies,
} from "../../services";
import { useParams } from "react-router-dom";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import "../Gerais/styles/cadastros.css";

export default function CadastroHabitat({ onSuccess, onClose }) {
  const { id: habitatId } = useParams();

  const [habitat, setHabitat] = useState(null);
  const [recintos, setRecintos] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();

  useEffect(() => {
    async function carregarDados() {
      try {
        const rec = await listarRecintos(0, 1000);
        const esp = await listarEspecies(0, 1000);
        setRecintos(rec.itens || rec);
        setEspecies(esp.itens || esp);
        if (habitatId) {
          const h = await buscarHabitatPorId(habitatId);
          setHabitat(h);
        }
        setLoading(false);
      } catch {
        showModal("Erro", "Erro ao carregar dados.");
        setLoading(false);
      }
    }
    carregarDados();
  }, [habitatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const nome = form.get("nome")?.trim();
    const recintoId = form.get("recintoId");
    const especieId = form.get("especieId");
    const maxCapacidade = Number(form.get("maxCapacidade"));

    if (!nome || !recintoId || !especieId || !maxCapacidade) {
      showModal("Erro de validação", "Preencha todos os campos corretamente.");
      return;
    }

    const dto = { nome, recintoId: Number(recintoId), especieId: Number(especieId), maxCapacidade };

    try {
      if (habitatId) {
        await atualizarHabitat(habitatId, dto);
        showModal("Sucesso", "Habitat atualizado com sucesso.");
      } else {
        await cadastrarHabitat(dto);
        showModal("Sucesso", "Habitat cadastrado com sucesso.");
        e.target.reset();
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (errors) {
      if (Array.isArray(errors)) {
        const msgs = errors.map((e) => `${e.propriedade}: ${e.mensagem}`).join("\n");
        showModal("Erro ao salvar", msgs);
      } else {
        showModal("Erro ao salvar", "Erro inesperado ao salvar habitat.");
      }
    }
  };

  if (loading) return <p>Carregando dados...</p>;

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>{habitatId ? "Editar Habitat" : "Cadastrar Habitat"}</h2>

        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            defaultValue={habitat?.nome || ""}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Recinto:</label>
          <select
            name="recintoId"
            defaultValue={habitat?.recintoId || ""}
            required
            className="form-input"
          >
            <option value="">-- Selecione o Recinto --</option>
            {recintos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome} (Máx Habitats: {r.capacidadeMaxHabitats})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Espécie:</label>
          <select
            name="especieId"
            defaultValue={habitat?.especieId || ""}
            required
            className="form-input"
          >
            <option value="">-- Selecione a Espécie --</option>
            {especies.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} (Categoria: {e.categoriaNome})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Capacidade Máxima:</label>
          <input
            type="number"
            name="maxCapacidade"
            min={1}
            defaultValue={habitat?.maxCapacidade || ""}
            required
            className="form-input"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="button-submit">
            {habitatId ? "Atualizar" : "Cadastrar"}
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="button-reset">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <ModalAlert open={modalOpen} title={modalTitle} message={modalMessage} onClose={closeModal} />
    </>
  );
}
