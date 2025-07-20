import { useNavigate } from "react-router-dom";
import "../Gerais/styles/cardBase.css";

export default function EspecieCard({ item }) {
  const navigate = useNavigate();

  if (!item) return null;

  const handleClick = () => {
    navigate(`/especies/perfil/${item.id}`);
  };

  return (
    <div className="card-base" onClick={handleClick}>
      <h3>{item.nome}</h3>
      <p><strong>Categoria:</strong> {item.categoriaNome}</p>
      <p><strong>Alimentação:</strong> {item.alimentacao}</p>
      <p><strong>Comportamento:</strong> {item.comportamento}</p>
      {item.animaisNomes && item.animaisNomes.length > 0 && (
        <p><strong>Animais:</strong> {item.animaisNomes.join(", ")}</p>
      )}
      <p><strong>Habitat Preferencial:</strong> {item.habitatNome || "Não definido"}</p>
    </div>
  );
}