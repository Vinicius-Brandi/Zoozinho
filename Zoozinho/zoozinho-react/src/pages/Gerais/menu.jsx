import { Link } from 'react-router-dom';
import './styles/header.css';

export function Menu() {
  return (
    <header>
      <nav>
        <ul className="menu">
          <li className="dropdown">
            <span>Categorias</span>
            <ul className="dropdown-content">
              <li><Link to="/categorias/cadastro">Cadastrar</Link></li>
              <li><Link to="/categorias">Visualizar</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span>Localização</span>
            <ul className="dropdown-content">
              <li><Link to="/habitats">Habitats</Link></li>
              <li>
                Galpão
                <ul className="dropdown-content-2">
                  <li><Link to= "/galpao/editar">Editar</Link></li>
                  <li><Link to="/galpao/relatorio">Relatorio</Link></li>
                </ul>
                </li>
              <li><Link to="/recintos">Recintos</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span>Espécies</span>
            <ul className="dropdown-content">
              <li><Link to="/especies/cadastro">Cadastrar</Link></li>
              <li><Link to="/especies">Visualizar</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <span>Animais</span>
            <ul className="dropdown-content">
              <li><Link to="/animais/cadastro">Cadastrar</Link></li>
              <li><Link to="/animais">Visualizar</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
