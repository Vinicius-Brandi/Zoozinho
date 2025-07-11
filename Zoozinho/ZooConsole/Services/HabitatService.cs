using System.ComponentModel.DataAnnotations;
using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Repository;

namespace ZooConsole.Services
{
    public class HabitatService
    {
        private readonly IRepositorio _repository;

        public HabitatService(IRepositorio repository)
        {
            _repository = repository;
        }

        public bool Cadastrar(HabitatDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var habitat = new Habitat
            {
                Nome = dto.Nome,
                RecintoId = dto.RecintoId,
                EspecieId = dto.EspecieId,
                MaxCapacidade = dto.MaxCapacidade
            };

            if (!Validar(habitat, out mensagens))
                return false;

            habitat.Recinto = _repository.ConsultarPorId<Recinto>(dto.RecintoId);
            habitat.Especie = _repository.ConsultarPorId<Especie>(dto.EspecieId);

            return Salvar(habitat, mensagens, isNew: true);
        }

        public bool Atualizar(long id, HabitatDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var habitat = _repository.ConsultarPorId<Habitat>(id);
            if (habitat == null)
            {
                mensagens.Add(new MensagemErro("Id", "Habitat não encontrado."));
                return false;
            }

            habitat.Nome = dto.Nome;
            habitat.RecintoId = dto.RecintoId;
            habitat.EspecieId = dto.EspecieId;
            habitat.MaxCapacidade = dto.MaxCapacidade;

            if (!Validar(habitat, out mensagens))
                return false;

            habitat.Recinto = _repository.ConsultarPorId<Recinto>(dto.RecintoId);
            habitat.Especie = _repository.ConsultarPorId<Especie>(dto.EspecieId);

            return Salvar(habitat, mensagens, isNew: false);
        }

        public Habitat? BuscarPorId(long id) => _repository.ConsultarPorId<Habitat>(id);

        public List<Habitat> Listar() => _repository.Consultar<Habitat>().ToList();

        public bool Deletar(long id, out List<MensagemErro> mensagens, bool forcar = false)
        {
            mensagens = new List<MensagemErro>();

            var habitat = _repository.ConsultarPorId<Habitat>(id);
            if (habitat == null)
            {
                mensagens.Add(new MensagemErro("Id", "Habitat não encontrado."));
                return false;
            }

            if (!forcar && habitat.Animais.Any())
            {
                mensagens.Add(new MensagemErro("Animais", "Este habitat possui animais associados."));
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Excluir(habitat);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao excluir habitat: {ex.Message}"));
                return false;
            }
        }

        private bool Validar(Habitat habitat, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var contexto = new ValidationContext(habitat);
            var resultados = new List<ValidationResult>();
            bool valido = Validator.TryValidateObject(habitat, contexto, resultados, true);

            mensagens.AddRange(resultados.Select(r =>
                new MensagemErro(r.MemberNames.FirstOrDefault() ?? "Desconhecido", r.ErrorMessage)));

            var recinto = _repository.ConsultarPorId<Recinto>(habitat.RecintoId);
            var especie = _repository.ConsultarPorId<Especie>(habitat.EspecieId);

            if (recinto == null)
            {
                mensagens.Add(new MensagemErro("RecintoId", "Recinto não encontrado."));
                valido = false;
            }

            if (especie == null)
            {
                mensagens.Add(new MensagemErro("EspecieId", "Espécie não encontrada."));
                valido = false;
            }

            if (recinto != null && especie != null)
            {
                if (recinto.CategoriaId != especie.Categoria?.Id)
                {
                    mensagens.Add(new MensagemErro("Categoria", "Recinto e Espécie devem pertencer à mesma categoria."));
                    valido = false;
                }

                int habitatsCount = _repository.Consultar<Habitat>()
                    .Count(h => h.RecintoId == habitat.RecintoId && h.Id != habitat.Id);

                if (habitatsCount >= recinto.CapacidadeMaxHabitats)
                {
                    mensagens.Add(new MensagemErro("RecintoId", $"Recinto '{recinto.Nome}' atingiu o limite de habitats ({recinto.CapacidadeMaxHabitats})."));
                    valido = false;
                }
            }

            return valido;
        }

        private bool Salvar(Habitat habitat, List<MensagemErro> mensagens, bool isNew)
        {
            try
            {
                using var transacao = _repository.IniciarTransacao();

                if (isNew)
                    _repository.Incluir(habitat);
                else
                    _repository.Salvar(habitat);

                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao salvar habitat: {ex.Message}"));
                return false;
            }
        }
    }
}
