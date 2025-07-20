import React from 'react';
import { useNavigate } from "react-router-dom";
import "../Gerais/styles/cardBase.css";

export default function CategoriaCard({ item: categoria }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/categorias/perfil/${categoria.id}`);
  };

  return (
    <div className="card-base" onClick={handleClick}>
      <h3>{categoria.nome}</h3>
      <p>ID: {categoria.id}</p>
      {categoria.recintoNome && <p>Recinto: {categoria.recintoNome}</p>}
      {categoria.especiesNomes && categoria.especiesNomes.length > 0 && (
        <p>Espécies: {categoria.especiesNomes.join(', ')}</p>
      )}
    </div>
  );
}
