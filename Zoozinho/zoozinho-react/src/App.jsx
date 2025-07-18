import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroAnimal from './pages/Animais/cadastroAnimal';
import CadastroCategoria from './pages/Categorias/cadastroCategoria';
import CadastroEspecie from './pages/Especies/cadastroEspecie';
import PerfilAnimal from './pages/Animais/perfilAnimal';
import ListaAnimais from './pages/Animais/listaAnimais';
import { Menu } from './pages/Gerais/menu';
import EditarGalpao from './pages/Galpao/editarGalpao';
import RelatorioGalpao from './pages/Galpao/relatorioGalpao';
import RelatorioRecinto from './pages/Recintos/relatorioRecinto';
import CadastroRecinto from './pages/Recintos/cadastroRecinto';

function App() {
  return (
    <BrowserRouter>
    {<Menu />}
      <Routes>
        <Route path="/" element={<h1>Teste funciona!</h1>} />
        <Route path="/animais" element={<ListaAnimais />} />
        <Route path="/animais/cadastro" element={<CadastroAnimal />} />

        <Route path="/animais/editar/:id" element={<CadastroAnimal />} />
        <Route path="/categorias/cadastro" element={<CadastroCategoria />} />
        <Route path="/categorias/editar/:id" element={<CadastroCategoria />} />
        <Route path="/especies/cadastro" element={<CadastroEspecie />} />
        <Route path="/especies/editar/:id" element={<CadastroEspecie />} />

        <Route path="/galpao/editar" element={<EditarGalpao />} />
        <Route path="/galpao/relatorio" element={<RelatorioGalpao/>} />

        <Route path="/recintos/relatorio/:id" element={<RelatorioRecinto/>} />
        <Route path="/recintos/cadastro" element={<CadastroRecinto/>}/>
        <Route path="/recinto/editar/:id" element={<CadastroRecinto/>}/>

        <Route path="/animais/perfil/:id" element={<PerfilAnimal />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
