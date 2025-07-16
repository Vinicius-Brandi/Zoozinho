import React from "react";
import "./styles/modalAlerta.css";

export default function ModalAlert({ open, title, message, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
