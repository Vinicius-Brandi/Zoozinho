import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarCategoriaPorId, deletarCategoria } from "../../services/categoriaService";
import ModalAlert from "../Gerais/modalAlerta";
import { useModalAlert } from "../../services/config";
import CadastroCategoria from "./cadastroCategoria";
import "../Gerais/styles/cadastros.css";
import "../Gerais/styles/perfil.css";

export default function PerfilCategoria() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [modalEditarCategoriaOpen, setModalEditarCategoriaOpen] = useState(false);
  const {
    modalOpen: alertaAberto,
    modalTitle,
    modalMessage,
    showModal,
    closeModal,
  } = useModalAlert();

  const carregarCategoria = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await buscarCategoriaPorId(id);
      setCategoria(data);
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      setErro(`Erro ao carregar a categoria: ${error.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategoria();
  }, [id]);

  const handleEditarCategoria = () => {
    setModalEditarCategoriaOpen(true);
  };

  const handleVerEspecies = () => {
    navigate(`/categorias/${id}/especies`);
  };

  const handleExcluirCategoria = async () => {
    try {
      await deletarCategoria(categoria.id);
      showModal("Categoria excluída", "A categoria foi removida com sucesso.");
      setConfirmarExclusao(false);
      setTimeout(() => {
        navigate("/categorias");
      }, 1500);
    } catch (erros) {
      if (Array.isArray(erros)) {
        const mensagens = erros.map((e) => `${e.propriedade}: ${e.mensagem}`).join("\n");
        showModal("Erro ao excluir", mensagens);
      } else {
        showModal("Erro", "Erro inesperado ao excluir a categoria.");
      }
      setConfirmarExclusao(false);
    }
  };

  const handleCloseEditarCategoriaModal = () => {
    setModalEditarCategoriaOpen(false);
    carregarCategoria();
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  if (!categoria) return <p>Categoria não encontrada.</p>;

  return (
    <div className="pagina-detalhes">
      <h1>Detalhes da Categoria: {categoria.nome}</h1>

      <div className="secao-informacoes">
        <p><strong>ID:</strong> {categoria.id}</p>
        {categoria.recinto && (
          <p>
            <strong>Recinto Associado:</strong>{" "}
            <span
              className="link-style"
              onClick={() => navigate(`/recintos/perfil/${categoria.recinto.id}`)}
              title="Ver detalhes do recinto"
            >
              {categoria.recinto.nome}
            </span>
            {" "} (Capacidade: {categoria.recinto.capacidadeMaxHabitats})
          </p>
        )}
        {categoria.especiesNomes && categoria.especiesNomes.length > 0 && (
          <p>
            <strong>Espécies Associadas:</strong> {categoria.especiesNomes.join(", ")}
          </p>
        )}
      </div>

      <div className="button-group">
        <button onClick={handleEditarCategoria}>Editar Categoria</button> 

        <button onClick={handleVerEspecies} className="button-secondary-action">
          Ver Espécies
        </button>

        <button
          onClick={() => setConfirmarExclusao(true)}
          className="button-delete"
        >
          Excluir Categoria
        </button>
      </div>

      {confirmarExclusao && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir a categoria "{categoria.nome}"?</p>
            <div className="modal-button-group">
              <button onClick={handleExcluirCategoria} className="button-confirm"> 
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

      {modalEditarCategoriaOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <CadastroCategoria
              id={id}
              onClose={handleCloseEditarCategoriaModal}
              onSuccess={handleCloseEditarCategoriaModal}
            />
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
