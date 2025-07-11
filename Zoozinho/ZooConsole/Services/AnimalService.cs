using System.ComponentModel.DataAnnotations;
using ZooConsole.DTOs;
using ZooConsole.Enum;
using ZooConsole.Models;
using ZooConsole.Repository;
using System;

namespace ZooConsole.Services
{
    public class AnimalService
    {
        private readonly IRepositorio _repository;
        private readonly MovimentacaoService _movimentacaoService;

        public AnimalService(IRepositorio repository, MovimentacaoService movimentacaoService)
        {
            _repository = repository;
            _movimentacaoService = movimentacaoService;
        }

        public bool Cadastrar(AnimalDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var especie = _repository.ConsultarPorId<Especie>(dto.EspecieId);
            if (especie == null)
            {
                mensagens.Add(new MensagemErro("EspecieId", $"Espécie com ID {dto.EspecieId} não encontrada."));
                return false;
            }

            Habitat habitat = null;
            if (dto.HabitatId.HasValue)
            {
                habitat = _repository.ConsultarPorId<Habitat>(dto.HabitatId.Value);
                if (habitat == null)
                {
                    mensagens.Add(new MensagemErro("HabitatId", $"Habitat com ID {dto.HabitatId.Value} não encontrado."));
                    return false;
                }
                if (habitat.Especie.Id != dto.EspecieId)
                {
                    mensagens.Add(new MensagemErro("HabitatId", "O habitat não é compatível com a espécie."));
                    return false;
                }
            }

            Galpao galpao = null;
            if (dto.GalpaoId.HasValue)
            {
                galpao = _repository.ConsultarPorId<Galpao>(dto.GalpaoId.Value);
                if (galpao == null)
                {
                    mensagens.Add(new MensagemErro("GalpaoId", $"Galpão com ID {dto.GalpaoId.Value} não encontrado."));
                    return false;
                }
            }

            if (!ValidarAlocacaoAnimal(dto.EspecieId, habitat, galpao, mensagens))
                return false;

            if (!System.Enum.IsDefined(typeof(SexoAnimal), dto.Sexo))
            {
                mensagens.Add(new MensagemErro("Sexo", "Sexo inválido."));
                return false;
            }

            var animal = new Animal
            {
                Nome = dto.Nome,
                Sexo = dto.Sexo,
                Idade = dto.Idade,
                Peso = dto.Peso,
                Especie = especie,
                EspecieId = especie.Id,
                Habitat = habitat,
                HabitatId = habitat?.Id,
                Galpao = galpao,
                GalpaoId = galpao?.Id
            };

            if (!Validar(animal, mensagens))
                return false;

            if (!Salvar(animal, mensagens, isNew: true))
                return false;

            _movimentacaoService.RegistrarMovimentacao(animal, null, null, habitat, galpao);
            return true;
        }

        public bool Atualizar(long id, AnimalDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var animal = _repository.ConsultarPorId<Animal>(id);
            if (animal == null)
            {
                mensagens.Add(new MensagemErro("Id", "Animal não encontrado."));
                return false;
            }

            var especie = _repository.ConsultarPorId<Especie>(dto.EspecieId);
            if (especie == null)
            {
                mensagens.Add(new MensagemErro("EspecieId", $"Espécie com ID {dto.EspecieId} não encontrada."));
                return false;
            }

            Habitat habitat = null;
            if (dto.HabitatId.HasValue)
            {
                habitat = _repository.ConsultarPorId<Habitat>(dto.HabitatId.Value);
                if (habitat == null)
                {
                    mensagens.Add(new MensagemErro("HabitatId", $"Habitat com ID {dto.HabitatId.Value} não encontrado."));
                    return false;
                }
                if (habitat.Especie.Id != dto.EspecieId)
                {
                    mensagens.Add(new MensagemErro("HabitatId", "O habitat não é compatível com a espécie."));
                    return false;
                }
            }

            Galpao galpao = null;
            if (dto.GalpaoId.HasValue)
            {
                galpao = _repository.ConsultarPorId<Galpao>(dto.GalpaoId.Value);
                if (galpao == null)
                {
                    mensagens.Add(new MensagemErro("GalpaoId", $"Galpão com ID {dto.GalpaoId.Value} não encontrado."));
                    return false;
                }
            }

            if (!ValidarAlocacaoAnimal(dto.EspecieId, habitat, galpao, mensagens, idAtualizar: id))
                return false;

            if (!System.Enum.IsDefined(typeof(SexoAnimal), dto.Sexo))
            {
                mensagens.Add(new MensagemErro("Sexo", "Sexo inválido."));
                return false;
            }

            var origemHabitat = animal.Habitat;
            var origemGalpao = animal.Galpao;

            animal.Nome = dto.Nome;
            animal.Sexo = dto.Sexo;
            animal.Idade = dto.Idade;
            animal.Peso = dto.Peso;
            animal.Especie = especie;
            animal.EspecieId = especie.Id;
            animal.Habitat = habitat;
            animal.HabitatId = habitat?.Id;
            animal.Galpao = galpao;
            animal.GalpaoId = galpao?.Id;

            if (!Validar(animal, mensagens))
                return false;

            if (!Salvar(animal, mensagens, isNew: false))
                return false;

            _movimentacaoService.RegistrarMovimentacao(animal, origemHabitat, origemGalpao, habitat, galpao);
            return true;
        }

        public AnimalListagemDTO BuscarPorId(long id)
        {
            var animal = _repository.ConsultarPorId<Animal>(id);
            if (animal == null) return null;

            return new AnimalListagemDTO
            {
                Id = animal.Id,
                Nome = animal.Nome,
                Sexo = animal.Sexo,
                Idade = animal.Idade,
                Peso = animal.Peso,
                EspecieNome = animal.Especie.Nome,
                HabitatNome = animal.Habitat?.Nome ?? "Nenhum",
                GalpaoNome = animal.Galpao?.Nome ?? "Nenhum",
                Localizacao = animal.Localizacao
            };
        }

        public List<AnimalListagemDTO> Listar()
        {
            return _repository.Consultar<Animal>().ToList()
                .Select(a => new AnimalListagemDTO
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Sexo = a.Sexo,
                    Idade = a.Idade,
                    Peso = a.Peso,
                    EspecieNome = a.Especie.Nome,
                    HabitatNome = a.Habitat?.Nome ?? "Nenhum",
                    GalpaoNome = a.Galpao?.Nome ?? "Nenhum",
                    Localizacao = a.Localizacao
                })
                .ToList();
        }

        public bool Deletar(long id, out List<MensagemErro> mensagens, bool forcar = false)
        {
            mensagens = new List<MensagemErro>();
            var animal = _repository.ConsultarPorId<Animal>(id);
            if (animal == null)
            {
                mensagens.Add(new MensagemErro("Id", "Animal não encontrado."));
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Excluir(animal);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao excluir animal: {ex.Message}"));
                return false;
            }
        }

        private bool ValidarAlocacaoAnimal(long especieId, Habitat habitat, Galpao galpao, List<MensagemErro> mensagens, long idAtualizar = 0)
        {
            if (habitat != null && galpao != null)
            {
                mensagens.Add(new MensagemErro("HabitatId/GalpaoId", "Animal não pode estar em habitat e galpão ao mesmo tempo."));
                return false;
            }

            bool especieTemHabitat = _repository.Consultar<Habitat>().Any(h => h.Especie.Id == especieId);

            bool galpaoCheio = galpao != null &&
                _repository.Consultar<Animal>().Count(a => a.GalpaoId == galpao.Id && a.Id != idAtualizar) >= galpao.CapacidadeMaxima;

            bool habitatCheio = habitat != null &&
                _repository.Consultar<Animal>().Count(a => a.HabitatId == habitat.Id && a.Id != idAtualizar) >= habitat.MaxCapacidade;

            if (galpaoCheio && !especieTemHabitat)
            {
                mensagens.Add(new MensagemErro("Galpao", "Galpão está cheio e a espécie não possui habitat disponível."));
                return false;
            }
            if (galpaoCheio && especieTemHabitat && habitat == null)
            {
                mensagens.Add(new MensagemErro("Habitat", "Galpão está cheio. Escolha um habitat."));
                return false;
            }
            if (habitatCheio)
            {
                mensagens.Add(new MensagemErro("Habitat", "Habitat está cheio."));
                return false;
            }
            if (especieTemHabitat && habitat == null && galpao == null)
            {
                mensagens.Add(new MensagemErro("HabitatId/GalpaoId", "Informe habitat ou galpão."));
                return false;
            }
            if (!especieTemHabitat && galpao == null)
            {
                mensagens.Add(new MensagemErro("GalpaoId", "Espécie sem habitat, deve estar em galpão."));
                return false;
            }

            return true;
        }

        private bool Validar(Animal animal, List<MensagemErro> mensagens)
        {
            var contexto = new ValidationContext(animal);
            var erros = new List<ValidationResult>();
            bool valido = Validator.TryValidateObject(animal, contexto, erros, true);

            mensagens.AddRange(erros.Select(e => new MensagemErro(e.MemberNames.FirstOrDefault() ?? "Desconhecido", e.ErrorMessage)));

            if (animal.Especie == null)
            {
                mensagens.Add(new MensagemErro("Especie", "Espécie inválida."));
                valido = false;
            }

            return valido;
        }

        private bool Salvar(Animal animal, List<MensagemErro> mensagens, bool isNew)
        {
            try
            {
                using var transacao = _repository.IniciarTransacao();
                if (isNew)
                    _repository.Incluir(animal);
                else
                    _repository.Salvar(animal);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao salvar animal: {ex.Message}"));
                return false;
            }
        }
    }
}