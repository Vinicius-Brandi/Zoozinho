import { useEffect, useState, useMemo } from 'react';
import {
  listarEspecies,
  listarHabitats,
  mostrarGalpao,
  buscarAnimalPorId,
  cadastrarAnimal,
  atualizarAnimal,
} from '../../services';
import ModalAlert from '../Gerais/modalAlerta';
import { useModalAlert } from '../../services/config';

import './styles/cadastroAnimal.css';

export default function CadastroAnimal({ animalId = null, onClose, onSuccess }) {
  const [especies, setEspecies] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [galpao, setGalpao] = useState(null);

  const [especieTrancada, setEspecieTrancada] = useState(false);
  const [especieId, setEspecieId] = useState('');
  const [localTipo, setLocalTipo] = useState('');
  const [localId, setLocalId] = useState('');
  const [sexo, setSexo] = useState('');
  const [animalData, setAnimalData] = useState(null);

  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();

  useEffect(() => {
    listarEspecies().then(setEspecies);
    listarHabitats().then(setHabitats);
    mostrarGalpao().then(setGalpao);
  }, []);

  useEffect(() => {
    if (animalId) {
      buscarAnimalPorId(animalId).then(animal => {
        setAnimalData(animal);
        setEspecieId(animal.especieId.toString());
        setSexo(animal.sexo.toString());

        if (animal.habitatId) {
          setLocalTipo('Habitat');
          setLocalId(animal.habitatId.toString());
        } else if (animal.galpaoId) {
          setLocalTipo('Galpao');
          setLocalId(animal.galpaoId.toString());
        } else {
          setLocalTipo('');
          setLocalId('');
        }
      });
    } else {
      setAnimalData(null);
      setEspecieId('');
      setLocalTipo('');
      setLocalId('');
      setSexo('');
    }
  }, [animalId]);

  const habitatsFiltrados = useMemo(() => {
    if (!especieId) return habitats;
    return habitats.filter(h => h.especieId === Number(especieId));
  }, [especieId, habitats]);

  useEffect(() => {
    if (localTipo === 'Habitat') {
      if (!habitatsFiltrados.some(h => h.id === Number(localId))) {
        setLocalId('');
      }
      const habitat = habitats.find(h => h.id === Number(localId));
      if (habitat && habitat.especieId.toString() !== especieId) {
        setEspecieId(habitat.especieId.toString());
        setEspecieTrancada(true);
        return;
      }
      if (especieTrancada) setEspecieTrancada(false);
    } else {
      if (especieTrancada) setEspecieTrancada(false);
    }
  }, [localTipo, localId, habitatsFiltrados, especieId, especieTrancada, habitats]);

  const handleLocalTipoChange = (e) => {
    const tipo = e.target.value;
    setLocalTipo(tipo);
    if (tipo === 'Galpao' && galpao) {
      setLocalId(galpao.id.toString());
    } else {
      setLocalId('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const dto = {
      nome: formData.get('nome'),
      sexo: parseInt(formData.get('sexo')),
      idade: parseInt(formData.get('idade')),
      peso: parseFloat(formData.get('peso')),
      especieId: parseInt(especieId),
      habitatId: localTipo === 'Habitat' ? parseInt(localId) : null,
      galpaoId: localTipo === 'Galpao' ? parseInt(localId) : null,
    };

    if (
      !dto.nome ||
      isNaN(dto.idade) ||
      isNaN(dto.peso) ||
      isNaN(dto.sexo) ||
      isNaN(dto.especieId) ||
      !localTipo ||
      !localId
    ) {
      showModal('Erro de validação', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (animalId) {
        await atualizarAnimal(animalId, dto);
        showModal('Sucesso', 'Animal atualizado com sucesso.');
      } else {
        await cadastrarAnimal(dto);
        showModal('Sucesso', 'Animal cadastrado com sucesso.');
        form.reset();
        setEspecieId('');
        setLocalTipo('');
        setLocalId('');
        setEspecieTrancada(false);
        setSexo('');
      }
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (errors) {
      if (Array.isArray(errors)) {
        const mensagens = errors
          .map(e => `${e.propriedade || e.campo || "Erro"}: ${e.mensagem || e.message || ""}`)
          .join("\n");
        showModal('Erro ao salvar', mensagens);
      } else {
        showModal('Erro ao salvar', 'Erro inesperado ao salvar animal.');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nome:</label>
          <input
            name="nome"
            type="text"
            required
            defaultValue={animalData?.nome || ''}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Sexo:</label>
          <select
            name="sexo"
            required
            value={sexo}
            onChange={e => setSexo(e.target.value)}
            className="form-select"
          >
            <option value="" disabled>
              Selecione o sexo
            </option>
            <option value="0">Masculino</option>
            <option value="1">Feminino</option>
          </select>
        </div>

        <div className="form-group">
          <label>Idade:</label>
          <input
            name="idade"
            type="number"
            min="0"
            required
            defaultValue={animalData?.idade || ''}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Peso:</label>
          <input
            name="peso"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={animalData?.peso || ''}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Espécie:</label>
          <select
            value={especieId}
            onChange={e => setEspecieId(e.target.value)}
            required
            disabled={especieTrancada || localTipo === 'Habitat'}
            className="form-select"
          >
            <option value="">Selecione a espécie</option>
            {especies.map(e => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Local de alocação:</label>
          <select
            value={localTipo}
            onChange={handleLocalTipoChange}
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
              onChange={e => setLocalId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Selecione um habitat</option>
              {habitatsFiltrados.map(h => (
                <option key={h.id} value={h.id}>
                  {h.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {localTipo === 'Galpao' && galpao && (
          <div className="form-group">
            <label>Galpão:</label>
            <select
              value={localId}
              onChange={e => setLocalId(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Selecione o galpão</option>
              <option value={galpao.id}>{galpao.nome}</option>
            </select>
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="button-submit">
            {animalId ? 'Atualizar' : 'Cadastrar'}
          </button>
          <button type="button" onClick={onClose} className="button-reset">
            Cancelar
          </button>
        </div>
      </form>

      <ModalAlert
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </>
  );
}
