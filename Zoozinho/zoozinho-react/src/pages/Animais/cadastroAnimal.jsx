import React, { useEffect, useState, useMemo } from 'react';
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
import "../Gerais/styles/cadastros.css";

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
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [errorInitialData, setErrorInitialData] = useState(null);
  const { modalOpen, modalTitle, modalMessage, showModal, closeModal } = useModalAlert();
  useEffect(() => {
    const loadAllInitialData = async () => {
      setLoadingInitialData(true);
      setErrorInitialData(null);
      try {
        const especiesResponse = await listarEspecies();
        setEspecies(especiesResponse.itens || []);

        const habitatsResponse = await listarHabitats();
        setHabitats(habitatsResponse.itens || []);

        const galpaoData = await mostrarGalpao();
        setGalpao(galpaoData);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setErrorInitialData("Erro ao carregar opções do formulário.");
        showModal("Erro", "Erro ao carregar opções do formulário.");
      } finally {
        setLoadingInitialData(false);
      }
    };
    loadAllInitialData();
  }, [showModal]);
  useEffect(() => {
    if (animalId) {
      buscarAnimalPorId(animalId)
        .then(animal => {
          setAnimalData(animal);
          setEspecieId(animal.especieId?.toString() || '');
          setSexo(animal.sexo?.toString() || '');

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
        })
        .catch(error => {
          console.error("Erro ao carregar dados do animal para edição:", error);
          showModal("Erro", "Não foi possível carregar os dados do animal para edição.");
        });
    } else {
      setAnimalData(null);
      setEspecieId('');
      setLocalTipo('');
      setLocalId('');
      setSexo('');
      setEspecieTrancada(false);
    }
  }, [animalId, showModal]);

  const habitatsFiltrados = useMemo(() => {
    if (!especieId) return habitats;
    return habitats.filter(h => h.especieId === Number(especieId));
  }, [especieId, habitats]);

  useEffect(() => {
    if (localTipo === 'Habitat') {
      if (localId && !habitatsFiltrados.some(h => h.id === Number(localId))) {
        setLocalId('');
      }
      const habitat = habitats.find(h => h.id === Number(localId));
      if (habitat && habitat.especieId?.toString() !== especieId) {
        setEspecieId(habitat.especieId.toString());
        setEspecieTrancada(true);
        return;
      }
      if (especieTrancada && (!habitat || habitat.especieId?.toString() === especieId)) {
        setEspecieTrancada(false);
      }
    } else {
      if (especieTrancada) setEspecieTrancada(false);
    }
  }, [localTipo, localId, habitatsFiltrados, especieId, especieTrancada, habitats]);

  const handleLocalTipoChange = (e) => {
    const tipo = e.target.value;
    setLocalTipo(tipo);
    if (tipo === 'Galpao' && galpao) {
      setLocalId(galpao.id?.toString() || '');
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
      } else if (errors && errors.message) {
        showModal('Erro ao salvar', errors.message);
      } else {
        showModal('Erro ao salvar', 'Erro inesperado ao salvar animal.');
      }
    }
  };
  if (loadingInitialData) {
    return <p className="loading-message">Carregando formulário...</p>;
  }
  if (errorInitialData) {
    return <p className="error-message">{errorInitialData}</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>{animalId ? 'Editar Animal' : 'Cadastrar Animal'}</h2>

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
          {animalId && (
            <button type="button" onClick={onClose} className="button-reset">
              Cancelar
            </button>
          )}
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