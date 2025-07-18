import { useEffect, useRef, useState } from 'react';
import {
  cadastrarRecinto,
  atualizarRecinto,
  buscarRecintoPorId,
  listarCategorias,
} from '../../services';
import { useParams } from 'react-router-dom';
import { useModalAlert } from '../../services/config';
import ModalAlert from '../Gerais/modalAlerta';
import "../Gerais/styles/cadastros.css";

export default function CadastroRecinto({ onSuccess, onClose }) {
  const { id } = useParams();
  const formRef = useRef();
  const [categorias, setCategorias] = useState([]);
  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    if (id && categorias.length > 0) {
      buscarRecintoPorId(id).then((recinto) => {
        if (formRef.current) {
          formRef.current.nome.value = recinto.nome || '';
          formRef.current.capacidadeMaxHabitats.value = recinto.capacidadeMaxHabitats ?? '';
          formRef.current.categoriaId.value = recinto.categoriaId ?? '';
        }
      });
    } else if (formRef.current) {
      formRef.current.reset();
    }
  }, [id, categorias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);

    const dto = {
      nome: form.get('nome')?.trim(),
      categoriaId: parseInt(form.get('categoriaId')),
      capacidadeMaxHabitats: parseInt(form.get('capacidadeMaxHabitats')),
    };

    if (!dto.nome || isNaN(dto.categoriaId) || isNaN(dto.capacidadeMaxHabitats)) {
      showModal("Erro de validação", "Preencha todos os campos obrigatórios.");
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
    } catch (errors) {
      if (Array.isArray(errors)) {
        const mensagem = errors
          .map(e => `• ${e.mensagem || e.message || "Erro desconhecido"}`)
          .join("\n");
        showModal("Erro ao salvar", mensagem);
      } else {
        showModal("Erro", "Erro inesperado ao salvar recinto.");
      }
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="form-container">
        <h2>{id ? "Editar Recinto" : "Cadastrar Recinto"}</h2>

        <div className="form-group">
          <label>Nome:</label>
          <input name="nome" type="text" required className="form-input" />
        </div>

        <div className="form-group">
          <label>Capacidade Máxima de Habitats:</label>
          <input
            name="capacidadeMaxHabitats"
            type="number"
            min={1}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          <select name="categoriaId" required className="form-select">
            <option value="">Selecione a categoria</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="button-submit">
            {id ? "Atualizar" : "Cadastrar"}
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="button-reset">
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
