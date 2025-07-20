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
import ListaRecinto from './pages/Recintos/listaRecinto';
import PerfilRecinto from './pages/Recintos/perfilRecinto';
import CadastroHabitat from './pages/Habitats/cadastroHabitat';
import ListaHabitat from './pages/Habitats/listaHabitat';
import PerfilHabitat from './pages/Habitats/perfilHabitat';
import ListaCategorias from './pages/Categorias/listaCategoria';
import PerfilCategoria from './pages/Categorias/perfilCategoria';
import ListaEspecies from './pages/Especies/listaEspecies';
import PerfilEspecie from './pages/Especies/perfilEspecie';


function App() {
  return (
    <BrowserRouter>
    {<Menu />}
      <Routes>
        <Route path="/" element={<CadastroCategoria/>} />

        {/* Rotas de Animais */}
        <Route path="/animais" element={<ListaAnimais />} />
        <Route path="/animais/cadastro" element={<CadastroAnimal />} />
        <Route path="/animais/editar/:id" element={<CadastroAnimal />} />
        <Route path="/animais/perfil/:id" element={<PerfilAnimal />} />

        <Route path="/habitats/:habitatId/animais" element={<ListaAnimais />} />
        <Route path="/especies/:especieId/animais" element={<ListaAnimais/>}/>

        {/* Rotas de Categorias */}
        <Route path="/categorias/cadastro" element={<CadastroCategoria />} />
        <Route path="/categorias/editar/:id" element={<CadastroCategoria />} />
        <Route path="/categorias" element={<ListaCategorias/>}/>
        <Route path="/categorias/perfil/:id" element={<PerfilCategoria/>}/>

        {/* Rotas de Espécies */}
        <Route path="/especies/cadastro" element={<CadastroEspecie />} />
        <Route path="/especies/editar/:id" element={<CadastroEspecie />} />
        <Route path="especies" element={<ListaEspecies/>}/>
        <Route path="/categorias/:categoriaId/especies" element={<ListaEspecies/>}/>
        <Route path="/especies/perfil/:id" element={<PerfilEspecie/>}/>

        {/* Rotas de Galpão */}
        <Route path="/galpao/editar" element={<EditarGalpao />} />
        <Route path="/galpao/relatorio" element={<RelatorioGalpao/>} />

        {/* Rotas de Recintos */}
        <Route path="/recintos/relatorio/:id" element={<RelatorioRecinto/>} />
        <Route path="/recintos/cadastro" element={<CadastroRecinto/>}/>
        <Route path="/recintos/editar/:id" element={<CadastroRecinto/>}/>
        <Route path="/recintos" element={<ListaRecinto/>}/>
        <Route path="/recintos/perfil/:id" element={<PerfilRecinto />} />
        <Route path="/recintos/:recintoId/habitats" element={<ListaHabitat/>}/>

        {/* Rotas de Habitats */}
        <Route path="/habitats/cadastro" element={<CadastroHabitat/>}/>
        <Route path="/habitats/editar/:id" element={<CadastroHabitat/>}/>
        <Route path="/habitats" element={<ListaHabitat/>}/>
        <Route path="/habitats/perfil/:id" element={<PerfilHabitat/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;