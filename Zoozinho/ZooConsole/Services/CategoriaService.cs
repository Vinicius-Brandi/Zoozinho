using System.ComponentModel.DataAnnotations;
using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Repository;

namespace ZooConsole.Services
{
    public class CategoriaService
    {
        private readonly IRepositorio _repository;

        public CategoriaService(IRepositorio repository)
        {
            _repository = repository;
        }

        public bool Cadastrar(CategoriaDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            if (ExisteCategoriaComNome(dto.Nome))
            {
                mensagens.Add(new MensagemErro("Nome", "Já existe uma categoria com esse nome."));
                return false;
            }

            var categoria = new Categoria { Nome = dto.Nome };

            if (!Validar(categoria, mensagens)) return false;

            return Salvar(categoria, mensagens, isNew: true);
        }

        public bool Atualizar(long id, CategoriaDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var categoria = _repository.ConsultarPorId<Categoria>(id);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("Id", "Categoria não encontrada."));
                return false;
            }

            if (ExisteCategoriaComNome(dto.Nome, id))
            {
                mensagens.Add(new MensagemErro("Nome", "Já existe uma categoria com esse nome."));
                return false;
            }

            categoria.Nome = dto.Nome;

            if (!Validar(categoria, mensagens)) return false;

            return Salvar(categoria, mensagens, isNew: false);
        }

        public CategoriaListagemDTO? BuscarPorId(long id)
        {
            var c = _repository.ConsultarPorId<Categoria>(id);
            if (c == null) return null;

            return new CategoriaListagemDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                EspeciesNomes = c.Especies?.Select(e => e.Nome).ToList() ?? new List<string>(),
                Recinto = c.Recinto == null ? null : new RecintoResumoDTO
                {
                    Id = c.Recinto.Id,
                    Nome = c.Recinto.Nome,
                    CapacidadeMaxHabitats = c.Recinto.CapacidadeMaxHabitats
                }
            };
        }

        public TotalItens<CategoriaListagemDTO> Listar(int skip = 0, int pageSize = 10, string pesquisa = null)
        {
            IQueryable<Categoria> consulta = _repository.Consultar<Categoria>();

            if (!string.IsNullOrEmpty(pesquisa))
            {
                consulta = consulta.Where(c => c.Nome.ToLower().Contains(pesquisa.ToLower()));
            }

            consulta = consulta.OrderBy(c => c.Nome);
            int total = consulta.Count();

            if (skip > 0)
            {
                consulta = consulta.Skip(skip);
            }

            if (pageSize > 0)
            {
                consulta = consulta.Take(pageSize);
            }

            var itens = consulta.ToList()
                .Select(c => new CategoriaListagemDTO
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    EspeciesNomes = c.Especies?.Select(e => e.Nome).ToList() ?? new List<string>(),
                    Recinto = c.Recinto == null ? null : new RecintoResumoDTO
                    {
                        Id = c.Recinto.Id,
                        Nome = c.Recinto.Nome,
                        CapacidadeMaxHabitats = c.Recinto.CapacidadeMaxHabitats
                    }
                })
                .ToList();

            return new TotalItens<CategoriaListagemDTO>
            {
                Total = total,
                Itens = itens
            };
        }
        public bool Deletar(long id, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var categoria = _repository.ConsultarPorId<Categoria>(id);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("Id", "Categoria não encontrada para exclusão."));
                return false;
            }

            if (categoria.Especies?.Any() == true)
                mensagens.Add(new MensagemErro("Especies", "Esta categoria possui espécies associadas."));

            if (categoria.Recinto != null)
                mensagens.Add(new MensagemErro("Recinto", "Esta categoria está vinculada a um recinto."));

            if (mensagens.Any())
                return false;

            try
            {
                using var transacao = _repository.IniciarTransacao();

                _repository.Excluir(categoria);

                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao excluir categoria: {ex.Message}"));
                return false;
            }
        }

        private bool Validar(Categoria categoria, List<MensagemErro> mensagens)
        {
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(categoria, contexto, resultados, true);

            mensagens.AddRange(resultados.Select(r =>
                new MensagemErro(r.MemberNames.FirstOrDefault() ?? "Desconhecido", r.ErrorMessage)));

            return valido;
        }

        private bool ExisteCategoriaComNome(string nome, long idExcluir = 0)
        {
            var nomeTrimmed = nome.Trim();
            return _repository.Consultar<Categoria>()
                .Any(c => c.Nome == nomeTrimmed && c.Id != idExcluir);
        }

        private bool Salvar(Categoria categoria, List<MensagemErro> mensagens, bool isNew)
        {
            try
            {
                using var transacao = _repository.IniciarTransacao();

                if (isNew)
                    _repository.Incluir(categoria);
                else
                    _repository.Salvar(categoria);

                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao salvar categoria: {ex.Message}"));
                return false;
            }
        }
    }
}
