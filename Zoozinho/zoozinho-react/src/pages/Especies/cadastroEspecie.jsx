import React, { useEffect, useState, useRef } from "react";
import {
  listarCategorias,
  buscarEspeciePorId,
  cadastrarEspecie,
  atualizarEspecie,
} from "../../services";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import "../Gerais/styles/cadastros.css";

export default function CadastroEspecie({ id, onSuccess, onClose }) {
  const formRef = useRef();

  const [categorias, setCategorias] = useState([]);
  const [especieData, setEspecieData] = useState(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState("");

  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();

  useEffect(() => {
    listarCategorias()
      .then((res) => setCategorias(res.itens || []))
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        showModal("Erro", "Erro ao carregar as categorias.");
        setCategorias([]);
      });
  }, [showModal]);

  useEffect(() => {
    if (id) {
      buscarEspeciePorId(id)
        .then((especie) => {
          setEspecieData(especie);
          setSelectedCategoriaId(especie.categoriaId?.toString() || "");
        })
        .catch((err) => {
          console.error("Erro ao carregar espécie para edição:", err);
          showModal("Erro", "Não foi possível carregar os dados da espécie para edição.");
        });
    } else {
      setEspecieData(null);
      setSelectedCategoriaId("");
    }
  }, [id, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const dto = {
      nome: form.get("nome")?.trim(),
      alimentacao: parseInt(form.get("alimentacao")),
      comportamento: parseInt(form.get("comportamento")),
      categoriaId: parseInt(selectedCategoriaId),
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
        setSelectedCategoriaId("");
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (errors) {
      console.error("Erro ao salvar espécie:", errors);
      if (Array.isArray(errors)) {
        const mensagens = errors
          .map((e) => `${e.propriedade || e.campo || "Erro"}: ${e.mensagem || e.message || ""}`)
          .join("\n");
        showModal("Erro ao salvar", mensagens);
      } else if (errors && errors.message) {
        showModal("Erro ao salvar", errors.message);
      } else {
        showModal("Erro ao salvar", "Erro inesperado ao salvar espécie.");
      }
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="form-container">
        <h2>{id ? "Editar Espécie" : "Cadastrar Espécie"}</h2>

        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            required
            className="form-input"
            defaultValue={especieData?.nome || ""}
          />
        </div>

        <div className="form-group">
          <label>Alimentação:</label>
          <select
            name="alimentacao"
            required
            className="form-select"
            defaultValue={especieData?.alimentacao?.toString() || ""}
          >
            <option value="">Selecione</option>
            <option value="0">Carnívoro</option>
            <option value="1">Herbívoro</option>
            <option value="2">Onívoro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Comportamento:</label>
          <select
            name="comportamento"
            required
            className="form-select"
            defaultValue={especieData?.comportamento?.toString() || ""}
          >
            <option value="">Selecione</option>
            <option value="0">Agressivo</option>
            <option value="1">Dócil</option>
            <option value="2">Indiferente</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          <select
            name="categoriaId"
            required
            className="form-select"
            value={selectedCategoriaId}
            onChange={(e) => setSelectedCategoriaId(e.target.value)}
          >
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
