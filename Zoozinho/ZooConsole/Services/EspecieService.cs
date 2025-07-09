using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Repository;
using System.ComponentModel.DataAnnotations;

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

            var categoria = _repository.ConsultarPorId<Categoria>(dto.CategoriaId);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("CategoriaId", $"Categoria com ID {dto.CategoriaId} não encontrada."));
                return false;
            }

            var especie = new Especie
            {
                Nome = dto.Nome,
                Alimentacao = dto.Alimentacao,
                Comportamento = dto.Comportamento,
                Categoria = categoria
            };

            var valido = Validar(especie, out var errosValidacao);
            mensagens.AddRange(errosValidacao);

            if (!valido)
                return false;

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Incluir(especie);
                _repository.Commit();
                return true;
            }
            catch
            {
                _repository.Rollback();
                return false;
            }
        }
        public List<EspecieListagemDTO> Listar()
        {
            var especies = _repository.Consultar<Especie>().ToList();
            return especies.Select(e => new EspecieListagemDTO
            {
                Id = e.Id,
                Nome = e.Nome,
                Alimentacao = e.Alimentacao,
                Comportamento = e.Comportamento,
                CategoriaNome = e.Categoria.Nome,
                AnimaisNomes = e.Animais?.Select(a => a.Nome).ToList() ?? new List<string>(),
                HabitatNome = e.Habitat?.Nome ?? "Nenhum"

            }).ToList();
        }
        public Especie BuscarPorId(long id)
        {
            return _repository.ConsultarPorId<Especie>(id);
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

            var categoria = _repository.ConsultarPorId<Categoria>(dto.CategoriaId);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("CategoriaId", $"Categoria com ID {dto.CategoriaId} não encontrada."));
                return false;
            }

            especie.Nome = dto.Nome;
            especie.Alimentacao = dto.Alimentacao;
            especie.Comportamento = dto.Comportamento;
            especie.Categoria = categoria;

            var valido = Validar(especie, out var errosValidacao);
            mensagens.AddRange(errosValidacao);

            if (!valido)
                return false;

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Salvar(especie);
                _repository.Commit();
                return true;
            }
            catch
            {
                _repository.Rollback();
                return false;
            }
        }

        public bool Validar(Especie especie, out List<MensagemErro> mensagens)
        {
            var contexto = new ValidationContext(especie);
            var erros = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(especie, contexto, erros, true);

            mensagens = erros.Select(e =>
                new MensagemErro(e.MemberNames.FirstOrDefault() ?? "Desconhecido", e.ErrorMessage)
            ).ToList();

            if (especie.Categoria == null)
            {
                mensagens.Add(new MensagemErro("Categoria", "Categoria não encontrada ou inválida."));
                valido = false;
            }

            return valido;
        }


        public Especie Deletar(long id)
        {
            var especie = BuscarPorId(id);
            if (especie == null || especie.Animais.Any() || especie.Habitat != null)
                return null;

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Excluir(especie);
                _repository.Commit();
                return especie;
            }
            catch
            {
                _repository.Rollback();
                return null;
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

