import { useNavigate } from "react-router-dom";
import "../Gerais/styles/cardBase.css";

export default function HabitatCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/habitats/perfil/${item.id}`);
  };

  return (
    <div className="card-base" onClick={handleClick}>
      <h3>{item.nome}</h3>
      <p><strong>Espécie:</strong> {item.especieNome}</p>
      <p><strong>Recinto:</strong> {item.recintoNome}</p>
      <p><strong>Capacidade Máxima:</strong> {item.capacidadeMaxima}</p>
    </div>
  );
}
