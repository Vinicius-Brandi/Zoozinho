import { useEffect, useState } from 'react';
import {
  buscarCategoriaPorId,
  cadastrarCategoria,
  atualizarCategoria,
} from '../../services';
import { useParams, useNavigate } from 'react-router-dom';
import ModalAlert from '../Gerais/modalAlerta';
import { useModalAlert } from '../../services/config';
import "../Gerais/styles/cadastros.css";

export default function CadastroCategoria({ onSuccess, onClose }) {
  const { id: categoriaId } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();
  useEffect(() => {
    if (categoriaId) {
      buscarCategoriaPorId(categoriaId)
        .then(setCategoria)
        .catch(() => showModal("Erro", "Erro ao carregar dados da categoria."));
    }
  }, [categoriaId, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const nome = form.get('nome')?.trim();

    if (!nome) {
      showModal("Erro de validação", "O nome é obrigatório.");
      return;
    }

    const dto = { nome };

    try {
      if (categoriaId) {
        await atualizarCategoria(categoriaId, dto);
        showModal("Sucesso", "Categoria atualizada com sucesso.");
      } else {
        await cadastrarCategoria(dto);
        showModal("Sucesso", "Categoria cadastrada com sucesso.");
        e.target.reset();
      }

      if (onSuccess) onSuccess();
      if (onClose) {
        onClose();
      } else if (categoriaId) {
        navigate(`/categorias/perfil/${categoriaId}`);
      } else {
        navigate('/categorias');
      }

    } catch (err) {
      showModal("Erro ao salvar", "Erro inesperado ao salvar categoria.");
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      if (categoriaId) {
        navigate(`/categorias/perfil/${categoriaId}`);
      } else {
        navigate('/categorias');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>{categoriaId ? 'Editar Categoria' : 'Cadastrar Categoria'}</h2>

        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            defaultValue={categoria?.nome || ''}
            required
            className="form-input"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="button-submit">
            {categoriaId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {categoriaId && (
            <button type="button" onClick={handleCancel} className="button-reset">
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