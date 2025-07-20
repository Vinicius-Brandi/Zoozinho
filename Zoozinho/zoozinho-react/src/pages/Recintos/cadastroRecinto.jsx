import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModalAlert } from "../../services/config";
import ModalAlert from "../Gerais/modalAlerta";
import {
  buscarRecintoPorId,
  cadastrarRecinto,
  atualizarRecinto,
  listarCategorias,
} from "../../services";
import "../Gerais/styles/cadastros.css";

export default function CadastroRecinto({ id, onClose, onSuccess }) {
  const formRef = useRef();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } =
    useModalAlert();

  useEffect(() => {
    listarCategorias().then((dados) => setCategorias(dados.itens || dados));
  }, []);
  useEffect(() => {
    if (id && categorias.length > 0) {
      buscarRecintoPorId(id).then((recinto) => {
        if (formRef.current) {
          formRef.current.nome.value = recinto.nome || "";
          formRef.current.capacidadeMaxHabitats.value =
            recinto.capacidadeMaxHabitats ?? "";
          if (recinto.categoriaId && categorias.some(cat => cat.id === recinto.categoriaId)) {
            formRef.current.categoriaId.value = String(recinto.categoriaId);
          } else {
            formRef.current.categoriaId.value = "";
          }
        }
      });
    } else if (formRef.current) {
      formRef.current.reset();
    }
  }, [id, categorias]);

  const salvar = async (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const dto = {
      nome: form.get("nome")?.trim(),
      capacidadeMaxHabitats: parseInt(form.get("capacidadeMaxHabitats")),
      categoriaId: parseInt(form.get("categoriaId")),
    };

    if (!dto.nome || isNaN(dto.capacidadeMaxHabitats) || isNaN(dto.categoriaId)) {
      showModal("Erro de validação", "Preencha todos os campos corretamente.");
      return;
    }

    try {
      if (id) {
        await atualizarRecinto(id, dto);
        showModal("Sucesso", "Recinto atualizado com sucesso.");
      } else {
        await cadastrarRecinto(dto);
        showModal("Sucesso", "Recinto cadastrado com sucesso.");
        formRef.current.reset();
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      else if (!id) navigate("/recintos");
      else navigate(`/recintos/perfil/${id}`);
    } catch (errors) {
      if (Array.isArray(errors)) {
        const mensagem = errors
          .map((e) => `• ${e.mensagem || e.message || "Erro desconhecido"}`)
          .join("\n");
        showModal("Erro ao salvar", mensagem);
      } else {
        showModal("Erro", "Erro inesperado ao salvar recinto.");
      }
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      if (id) {
        navigate(`/recintos/perfil/${id}`);
      } else {
        navigate("/recintos");
      }
    }
  };


  return (
    <>
      <form ref={formRef} onSubmit={salvar} className="form-container">
        <h2>{id ? "Editar Recinto" : "Cadastrar Recinto"}</h2>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input name="nome" type="text" required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="capacidadeMaxHabitats">Capacidade Máxima de Habitats:</label>
          <input
            name="capacidadeMaxHabitats"
            type="number"
            min={1}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoriaId">Categoria:</label>
          <select name="categoriaId" required className="form-select">
            <option value="">Selecione a categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="button-submit">
            {id ? "Atualizar" : "Cadastrar"}
          </button>
          {(onClose || id) && (
            <button
              type="button"
              className="button-reset"
              onClick={handleCancel}
            >
              Cancelar
            </button>
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