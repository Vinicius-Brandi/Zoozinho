// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroAnimal from './pages/Animais/cadastroAnimal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/animais/cadastro" element={<CadastroAnimal />} />
        {/* Outras rotas podem ser adicionadas aqui futuramente */}
      </Routes>
    </Router>
  );
}

export default App;
