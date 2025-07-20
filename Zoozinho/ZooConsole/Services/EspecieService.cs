using System.ComponentModel.DataAnnotations;
using ZooConsole.DTOs;
using ZooConsole.Enum;
using ZooConsole.Models;
using ZooConsole.Repository;
using NHibernate;

namespace ZooConsole.Services
{
    public class EspecieService
    {
        private readonly IRepositorio _repository;

        public EspecieService(IRepositorio repository)
        {
            _repository = repository;
        }

        public bool Cadastrar(EspecieDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var categoria = ObterCategoria(dto.CategoriaId, mensagens);
            if (categoria == null) return false;

            if (ExisteEspecieComNome(dto.Nome))
            {
                mensagens.Add(new MensagemErro("Nome", "Já existe uma espécie cadastrada com este nome."));
                return false;
            }

            var especie = new Especie
            {
                Nome = dto.Nome,
                Alimentacao = (Alimentacao)dto.Alimentacao,
                Comportamento = (Comportamento)dto.Comportamento,
                Categoria = categoria
            };

            if (!Validar(especie, mensagens)) return false;

            return Salvar(especie, mensagens, isNew: true);
        }

        public bool Atualizar(long id, EspecieDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var especie = _repository.ConsultarPorId<Especie>(id);
            if (especie == null)
            {
                mensagens.Add(new MensagemErro("Id", "Espécie não encontrada."));
                return false;
            }

            if (especie.Habitat != null && especie.Categoria.Id != dto.CategoriaId)
            {
                mensagens.Add(new MensagemErro("Categoria", "Não é possível alterar a categoria de uma espécie que já possui habitat associado."));
                return false;
            }

            var categoria = ObterCategoria(dto.CategoriaId, mensagens);
            if (categoria == null) return false;

            if (ExisteEspecieComNome(dto.Nome, id))
            {
                mensagens.Add(new MensagemErro("Nome", "Já existe uma espécie cadastrada com este nome."));
                return false;
            }

            especie.Nome = dto.Nome;
            especie.Alimentacao = (Alimentacao)dto.Alimentacao;
            especie.Comportamento = (Comportamento)dto.Comportamento;
            especie.Categoria = categoria;

            if (!Validar(especie, mensagens)) return false;

            return Salvar(especie, mensagens, isNew: false);
        }

        public EspecieListagemDTO BuscarPorId(long id)
        {
            var especie = _repository.ConsultarPorId<Especie>(id);
            if (especie == null) return null;

            return new EspecieListagemDTO
            {
                Id = especie.Id,
                Nome = especie.Nome,
                Alimentacao = especie.Alimentacao.ToString(),
                Comportamento = especie.Comportamento.ToString(),
                CategoriaId = especie.Categoria.Id,
                CategoriaNome = especie.Categoria.Nome,
                AnimaisNomes = especie.Animais?.Select(a => a.Nome).ToList() ?? new List<string>(),
                HabitatNome = especie.Habitat?.Nome ?? "Nenhum"
            };
        }

        public TotalItens<EspecieListagemDTO> Listar(int skip = 0, int pageSize = 10, string pesquisa = null, long? categoriaId = null)
        {
            IQueryable<Especie> consulta = _repository.Consultar<Especie>();
            if (categoriaId.HasValue && categoriaId.Value > 0)
            {
                consulta = consulta.Where(e => e.Categoria != null && e.Categoria.Id == categoriaId.Value);
            }

            if (!string.IsNullOrEmpty(pesquisa))
            {
                consulta = consulta.Where(e => e.Nome.ToLower().Contains(pesquisa.ToLower()));
            }
            consulta = consulta.OrderBy(e => e.Nome);

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
                .Select(e => new EspecieListagemDTO
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    Alimentacao = e.Alimentacao.ToString(),
                    Comportamento = e.Comportamento.ToString(),
                    CategoriaId = e.Categoria.Id,
                    CategoriaNome = e.Categoria.Nome,
                    AnimaisNomes = e.Animais?.Select(a => a.Nome).ToList() ?? new List<string>(),
                    HabitatNome = e.Habitat?.Nome ?? "Nenhum"
                }).ToList();

            return new TotalItens<EspecieListagemDTO>
            {
                Total = total,
                Itens = itens
            };
        }

        public bool Deletar(long id, out List<MensagemErro> mensagens, bool forcar = false)
        {
            mensagens = new List<MensagemErro>();
            var especie = _repository.ConsultarPorId<Especie>(id);

            if (especie == null)
            {
                mensagens.Add(new MensagemErro("Id", "Espécie não encontrada."));
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();

                if (!forcar)
                {
                    if ((especie.Animais?.Any() ?? false))
                        mensagens.Add(new MensagemErro("Animais", "Esta espécie possui animais associados."));
                    if (especie.Habitat != null)
                        mensagens.Add(new MensagemErro("Habitat", "Esta espécie está associada a um habitat."));

                    if (mensagens.Any())
                    {
                        _repository.Rollback();
                        return false;
                    }
                }
                else
                {
                    foreach (var animal in especie.Animais?.ToList() ?? new List<Animal>())
                    {
                        foreach (var mov in animal.Movimentacoes?.ToList() ?? new List<Movimentacao>())
                            _repository.Excluir(mov);

                        animal.Movimentacoes?.Clear();
                        animal.Galpao?.Animais?.Remove(animal);
                        animal.Habitat?.Animais?.Remove(animal);

                        animal.Galpao = null;
                        animal.Habitat = null;
                        animal.Especie = null;

                        _repository.Excluir(animal);
                    }
                    especie.Animais?.Clear();

                    if (especie.Habitat != null)
                    {
                        especie.Habitat.Especie = null;
                        especie.Habitat.Recinto?.Habitats?.Remove(especie.Habitat);
                        _repository.Excluir(especie.Habitat);
                        especie.Habitat = null;
                    }

                    especie.Categoria?.Especies?.Remove(especie);
                    especie.Categoria = null;
                }

                _repository.Excluir(especie);
                _repository.Commit();
                return true;
            }
            catch (StaleObjectStateException ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Concorrência", $"Erro de concorrência: A espécie pode já ter sido modificada ou excluída. Detalhes: {ex.Message}"));
                return false;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao excluir espécie: {ex.Message}"));
                return false;
            }
        }

        private Categoria ObterCategoria(long categoriaId, List<MensagemErro> mensagens)
        {
            var categoria = _repository.ConsultarPorId<Categoria>(categoriaId);
            if (categoria == null)
                mensagens.Add(new MensagemErro("CategoriaId", $"Categoria com ID {categoriaId} não encontrada."));
            return categoria;
        }

        private bool ExisteEspecieComNome(string nome, long idExcluir = 0)
        {
            var nomeLower = nome.Trim().ToLower();
            return _repository.Consultar<Especie>()
                .Any(e => e.Nome.Trim().ToLower() == nomeLower && e.Id != idExcluir);
        }

        private bool Validar(Especie especie, List<MensagemErro> mensagens)
        {
            var contexto = new ValidationContext(especie);
            var erros = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(especie, contexto, erros, true);

            mensagens.AddRange(erros.Select(e =>
                new MensagemErro(e.MemberNames.FirstOrDefault() ?? "Desconhecido", e.ErrorMessage)));

            if (especie.Categoria == null)
            {
                mensagens.Add(new MensagemErro("Categoria", "Categoria não encontrada ou inválida."));
                valido = false;
            }

            return valido;
        }

        private bool Salvar(Especie especie, List<MensagemErro> mensagens, bool isNew)
        {
            try
            {
                using var transacao = _repository.IniciarTransacao();
                if (isNew)
                    _repository.Incluir(especie);
                else
                    _repository.Salvar(especie);
                _repository.Commit();
                return true;
            }
            catch
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", "Erro ao salvar a espécie."));
                return false;
            }
        }

        public List<EspecieRelatorioDTO> RelatorioPorCategoria()
        {
            return _repository.Consultar<Especie>()
                .GroupBy(e => e.Categoria.Nome)
                .Select(g => new EspecieRelatorioDTO
                {
                    Categoria = g.Key,
                    Quantidade = g.Count()
                }).ToList();
        }
    }
}
