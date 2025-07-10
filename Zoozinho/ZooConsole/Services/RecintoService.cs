using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Repository;

namespace ZooConsole.Services
{
    public class RecintoService
    {
        private readonly IRepositorio _repository;

        public RecintoService(IRepositorio repository)
        {
            _repository = repository;
        }

        public bool Cadastrar(RecintoDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var categoria = _repository.ConsultarPorId<Categoria>(dto.CategoriaId);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("CategoriaId", $"Categoria com ID {dto.CategoriaId} não encontrada."));
                return false;
            }

            if (ExisteRecintoParaCategoria(dto.CategoriaId))
            {
                mensagens.Add(new MensagemErro("CategoriaId", "Já existe um recinto vinculado a esta categoria."));
                return false;
            }

            var recinto = new Recinto
            {
                Nome = dto.Nome,
                Categoria = categoria,
                CategoriaId = dto.CategoriaId,
                CapacidadeMaxHabitats = dto.CapacidadeMaxHabitats
            };

            if (!Validar(recinto, out mensagens)) return false;

            return Salvar(recinto, mensagens, isNew: true);
        }

        public bool Atualizar(long id, RecintoDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var recinto = _repository.ConsultarPorId<Recinto>(id);
            if (recinto == null)
            {
                mensagens.Add(new MensagemErro("Id", "Recinto não encontrado."));
                return false;
            }

            var categoria = _repository.ConsultarPorId<Categoria>(dto.CategoriaId);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("CategoriaId", $"Categoria com ID {dto.CategoriaId} não encontrada."));
                return false;
            }

            if (ExisteRecintoParaCategoria(dto.CategoriaId, id))
            {
                mensagens.Add(new MensagemErro("CategoriaId", "Outro recinto já está vinculado a esta categoria."));
                return false;
            }

            recinto.Nome = dto.Nome;
            recinto.Categoria = categoria;
            recinto.CategoriaId = dto.CategoriaId;
            recinto.CapacidadeMaxHabitats = dto.CapacidadeMaxHabitats;

            if (!Validar(recinto, out mensagens)) return false;

            return Salvar(recinto, mensagens, isNew: false);
        }

        public RecintoListagemDTO? BuscarPorId(long id)
        {
            var r = _repository.ConsultarPorId<Recinto>(id);
            if (r == null) return null;

            return new RecintoListagemDTO
            {
                Id = r.Id,
                Nome = r.Nome,
                CategoriaId = r.CategoriaId,
                CategoriaNome = r.Categoria?.Nome ?? "Sem categoria",
                CapacidadeMaxHabitats = r.CapacidadeMaxHabitats
            };
        }

        public List<RecintoListagemDTO> Listar()
        {
            return _repository.Consultar<Recinto>().ToList()
                .Select(r => new RecintoListagemDTO
                {
                    Id = r.Id,
                    Nome = r.Nome,
                    CategoriaId = r.CategoriaId,
                    CategoriaNome = r.Categoria?.Nome ?? "Sem categoria",
                    CapacidadeMaxHabitats = r.CapacidadeMaxHabitats
                })
                .ToList();
        }

        public bool Deletar(long id, out List<MensagemErro> mensagens, bool forcar = false)
        {
            mensagens = new List<MensagemErro>();

            var recinto = _repository.ConsultarPorId<Recinto>(id);
            if (recinto == null)
            {
                mensagens.Add(new MensagemErro("Id", "Recinto não encontrado."));
                return false;
            }

            if (!forcar && recinto.Habitats?.Any() == true)
            {
                mensagens.Add(new MensagemErro("Habitats", "O recinto possui habitats vinculados."));
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Excluir(recinto);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao excluir recinto: {ex.Message}"));
                return false;
            }
        }

        private bool ExisteRecintoParaCategoria(long categoriaId, long idExcluir = 0)
        {
            return _repository.Consultar<Recinto>()
                .Any(r => r.CategoriaId == categoriaId && r.Id != idExcluir);
        }

        private bool Validar(Recinto recinto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();
            var contexto = new ValidationContext(recinto);
            var resultados = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(recinto, contexto, resultados, true);

            mensagens.AddRange(resultados.Select(r =>
                new MensagemErro(r.MemberNames.FirstOrDefault() ?? "Desconhecido", r.ErrorMessage)));

            return valido;
        }

        private bool Salvar(Recinto recinto, List<MensagemErro> mensagens, bool isNew)
        {
            try
            {
                using var transacao = _repository.IniciarTransacao();
                if (isNew)
                    _repository.Incluir(recinto);
                else
                    _repository.Salvar(recinto);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao salvar recinto: {ex.Message}"));
                return false;
            }
        }
    }
}


