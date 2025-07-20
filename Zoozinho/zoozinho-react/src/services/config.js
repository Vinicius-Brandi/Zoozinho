import { useState, useCallback } from "react";

export const URL_API = "https://localhost:7100/api";

export function useModalAlert() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = useCallback((title, message) => {
    setModalTitle(title || "");
    setModalMessage(message || "");
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalTitle("");
    setModalMessage("");
  }, []);

  return {
    modalOpen,
    modalTitle,
    modalMessage,
    showModal,
    closeModal,
  };
}

export function RelatorioEmDados(relatorio) {
  if (!relatorio || !relatorio.especies) return [];

  return relatorio.especies.map(e => ({
    nome: e.especieNome,
    quantidade: e.quantidade,
  }));
}
