import { useEffect, useState, useRef } from 'react';
import {
  listarCategorias,
  buscarEspeciePorId,
  cadastrarEspecie,
  atualizarEspecie,
} from '../../services';
import { useParams } from 'react-router-dom';
import ModalAlert from '../Gerais/modalAlerta';
import { useModalAlert } from '../../services/config';
import "../Gerais/styles/cadastros.css"

export default function CadastroEspecie({ onSuccess, onClose }) {
  const { id } = useParams();
  const formRef = useRef();
  const [categorias, setCategorias] = useState([]);
  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);
  useEffect(() => {
    if (id && categorias.length > 0) {
      buscarEspeciePorId(id).then((especie) => {
        if (formRef.current) {
          formRef.current.nome.value = especie.nome;
          formRef.current.alimentacao.value = especie.alimentacao;
          formRef.current.comportamento.value = especie.comportamento;
          formRef.current.categoriaId.value = especie.categoriaId;
        }
      });
    }
  }, [id, categorias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const dto = {
      nome: form.get('nome')?.trim(),
      alimentacao: parseInt(form.get('alimentacao')),
      comportamento: parseInt(form.get('comportamento')),
      categoriaId: parseInt(form.get('categoriaId')),
    };

    if (!dto.nome || isNaN(dto.alimentacao) || isNaN(dto.comportamento) || isNaN(dto.categoriaId)) {
      showModal("Erro de validação", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      if (id) {
        await atualizarEspecie(id, dto);
        showModal("Sucesso", "Espécie atualizada com sucesso.");
      } else {
        await cadastrarEspecie(dto);
        showModal("Sucesso", "Espécie cadastrada com sucesso.");
        formRef.current.reset();
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      showModal("Erro ao salvar", "Erro inesperado ao salvar espécie.");
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="form-container">
        <h2>{id ? 'Editar Espécie' : 'Cadastrar Espécie'}</h2>

        <div className="form-group">
          <label>Nome:</label>
          <input type="text" name="nome" required className="form-input" />
        </div>

        <div className="form-group">
          <label>Alimentação:</label>
          <select name="alimentacao" required className="form-select">
            <option value="">Selecione</option>
            <option value="0">Carnívoro</option>
            <option value="1">Herbívoro</option>
            <option value="2">Onívoro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Comportamento:</label>
          <select name="comportamento" required className="form-select">
            <option value="">Selecione</option>
            <option value="0">Agressivo</option>
            <option value="1">Dócil</option>
            <option value="2">Indiferente</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          <select name="categoriaId" required className="form-select">
            <option value="">Selecione a categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="button-submit">
            {id ? 'Atualizar' : 'Cadastrar'}
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