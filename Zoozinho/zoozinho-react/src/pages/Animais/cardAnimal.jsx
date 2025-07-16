import { useNavigate } from "react-router-dom";
import "./styles/cardAnimal.css"

export default function AnimalCard({ animal }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/animais/perfil/${animal.id}`);
  };

  return (
    <div className="animal-card" onClick={handleClick}>
      <h3>{animal.nome}</h3>
      <p><strong>Espécie:</strong> {animal.especieNome}</p>
      <p><strong>Idade:</strong> {animal.idade} anos</p>
      <p><strong>Localização:</strong> {animal.localizacao || "Desconhecido"}</p>
    </div>
  );
}
