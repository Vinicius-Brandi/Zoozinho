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
                Alimentacao = dto.Alimentacao,
                Comportamento = dto.Comportamento,
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

            var categoria = ObterCategoria(dto.CategoriaId, mensagens);
            if (categoria == null) return false;

            if (ExisteEspecieComNome(dto.Nome, id))
            {
                mensagens.Add(new MensagemErro("Nome", "Já existe uma espécie cadastrada com este nome."));
                return false;
            }

            especie.Nome = dto.Nome;
            especie.Alimentacao = dto.Alimentacao;
            especie.Comportamento = dto.Comportamento;
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
                Alimentacao = especie.Alimentacao,
                Comportamento = especie.Comportamento,
                CategoriaNome = especie.Categoria?.Nome ?? "Sem categoria",
                AnimaisNomes = especie.Animais?.Select(a => a.Nome).ToList() ?? new List<string>(),
                HabitatNome = especie.Habitat?.Nome ?? "Nenhum"
            };
        }

        public List<EspecieListagemDTO> Listar()
        {
            return _repository.Consultar<Especie>().ToList()
                .Select(e => new EspecieListagemDTO
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    Alimentacao = e.Alimentacao,
                    Comportamento = e.Comportamento,
                    CategoriaNome = e.Categoria.Nome,
                    AnimaisNomes = e.Animais.Select(a => a.Nome).ToList(),
                    HabitatNome = e.Habitat?.Nome ?? "Nenhum"
                }).ToList();
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

            if (!forcar)
            {
                if (especie.Animais?.Any() == true)
                    mensagens.Add(new MensagemErro("Animais", "Esta espécie possui animais associados."));
                if (especie.Habitat != null)
                    mensagens.Add(new MensagemErro("Habitat", "Esta espécie está associada a um habitat."));
                if (mensagens.Any())
                    return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Excluir(especie);
                _repository.Commit();
                return true;
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
