import { useNavigate } from "react-router-dom";
import "../Gerais/styles/cardBase.css";

export default function RecintoCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recintos/perfil/${item.id}`);
  };

  return (
    <div className="card-base" onClick={handleClick}>
      <h3>{item.nome}</h3>
      <p><strong>Categoria:</strong> {item.categoriaNome}</p>
      <p><strong>Capacidade Máxima de Habitats:</strong> {item.capacidadeMaxHabitats}</p>
    </div>
  );
}
