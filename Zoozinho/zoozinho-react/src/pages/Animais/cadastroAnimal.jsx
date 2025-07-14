import { useEffect, useState } from 'react';
import {
  listarEspecies,
  listarHabitats,
  mostrarGalpao,
  cadastrarAnimal,
} from '../../services';
import './styles/cadastroAnimal.css';

export default function CadastroAnimal() {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');

  const [especies, setEspecies] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [galpao, setGalpao] = useState(null);

  const [especieId, setEspecieId] = useState('');
  const [localTipo, setLocalTipo] = useState('');
  const [localId, setLocalId] = useState('');
  const [habitatsFiltrados, setHabitatsFiltrados] = useState([]);

  const [especieTrancada, setEspecieTrancada] = useState(false);

  const sexoOptions = [
    { label: 'Selecione o sexo', value: '' },
    { label: 'Masculino', value: 0 },
    { label: 'Feminino', value: 1 },
  ];

  useEffect(() => {
    listarEspecies().then(setEspecies);
    listarHabitats().then(setHabitats);
    mostrarGalpao().then(setGalpao);
  }, []);

  useEffect(() => {
    if (especieId) {
      const filtrados = habitats.filter((h) => h.especieId === Number(especieId));
      setHabitatsFiltrados(filtrados);
      if (localTipo === 'Habitat' && !filtrados.some(h => h.id === Number(localId))) {
        setLocalId('');
      }
    } else {
      setHabitatsFiltrados(habitats);
      if (localTipo === 'Habitat') setLocalId('');
    }
  }, [especieId, habitats, localTipo, localId]);

  useEffect(() => {
    if (localTipo === 'Habitat' && localId) {
      const habitat = habitats.find((h) => h.id === Number(localId));
      if (habitat && habitat.especieId.toString() !== especieId) {
        setEspecieId(habitat.especieId.toString());
        setEspecieTrancada(true);
      }
    } else {
      if (especieTrancada) {
        setEspecieTrancada(false);
      }
    }
  }, [localTipo, localId, habitats, especieId, especieTrancada]);

  useEffect(() => {
    if (localTipo === 'Galpao') {
      setLocalId('');
      if (especieTrancada) setEspecieTrancada(false);
    }
  }, [localTipo, especieTrancada]);

  const resetSelecoes = () => {
    setEspecieId('');
    setLocalTipo('');
    setLocalId('');
    setEspecieTrancada(false);
  };

  const resetCampos = () => {
    setNome('');
    setSexo('');
    setIdade('');
    setPeso('');
    resetSelecoes();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!especieId || !localTipo || !localId || sexo === '') {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const dto = {
      nome,
      sexo,
      idade: idade ? parseInt(idade) : 0,
      peso: peso ? parseFloat(peso) : 0,
      especieId: parseInt(especieId),
      habitatId: localTipo === 'Habitat' ? parseInt(localId) : null,
      galpaoId: localTipo === 'Galpao' ? parseInt(localId) : null,
    };

    try {
      await cadastrarAnimal(dto);
      alert('Animal cadastrado com sucesso.');
      resetCampos();
    } catch (errors) {
      console.error(errors);
      alert('Erro ao cadastrar animal. Verifique os campos.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Sexo:</label>
        <select
          value={sexo}
          onChange={(e) => setSexo(e.target.value === '' ? '' : Number(e.target.value))}
          required
          className="form-select"
        >
          {sexoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Idade:</label>
        <input
          type="number"
          min="0"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Peso:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Espécie:</label>
        <select
          value={especieId}
          onChange={(e) => setEspecieId(e.target.value)}
          required
          disabled={especieTrancada || localTipo === 'Habitat'}
          className="form-select"
        >
          <option value="">Selecione a espécie</option>
          {especies.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Local de alocação:</label>
        <select
          value={localTipo}
          onChange={(e) => {
            setLocalTipo(e.target.value);
            setLocalId('');
          }}
          required
          className="form-select"
        >
          <option value="">Selecione o tipo</option>
          <option value="Habitat">Habitat</option>
          <option value="Galpao">Galpão</option>
        </select>
      </div>

      {localTipo === 'Habitat' && (
        <div className="form-group">
          <label>Habitat:</label>
          <select
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Selecione um habitat</option>
            {habitatsFiltrados.map((h) => (
              <option key={h.id} value={h.id}>{h.nome}</option>
            ))}
          </select>
        </div>
      )}

      {localTipo === 'Galpao' && galpao && (
        <div className="form-group">
          <label>Galpão:</label>
          <select
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Selecione o galpão</option>
            <option value={galpao.id}>{galpao.nome}</option>
          </select>
        </div>
      )}

      <div className="button-group">
        <button
          type="button"
          onClick={resetSelecoes}
          className="button-reset"
        >
          Resetar seleção
        </button>

        <button
          type="submit"
          className="button-submit"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}
