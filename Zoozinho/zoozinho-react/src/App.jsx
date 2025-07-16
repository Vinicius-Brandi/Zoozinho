import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroAnimal from './pages/Animais/cadastroAnimal';
import CadastroCategoria from './pages/Categorias/cadastroCategoria';
import CadastroEspecie from './pages/Especies/cadastroEspecie';
import PerfilAnimal from './pages/Animais/perfilAnimal';
import ListaAnimais from './pages/Animais/listaAnimais';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/animais" element={<ListaAnimais />} />
        <Route path="/animais/cadastro" element={<CadastroAnimal />} />

        <Route path="/animais/editar/:id" element={<CadastroAnimal />} />
        <Route path="/categorias/cadastro" element={<CadastroCategoria />} />
        <Route path="/categorias/editar/:id" element={<CadastroCategoria />} />
        <Route path="/especies/cadastro" element={<CadastroEspecie />} />
        <Route path="/especies/editar/:id" element={<CadastroEspecie />} />

        <Route path="/animais/perfil/:id" element={<PerfilAnimal />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
