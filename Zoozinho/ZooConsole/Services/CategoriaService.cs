using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
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

        public bool Cadastrar(Categoria categoria, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            if (!Validar(categoria, out var mensagensValidacao))
            {
                mensagens.AddRange(mensagensValidacao);
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Incluir(categoria);
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

        public List<Categoria> Listar()
        {
            return _repository.Consultar<Categoria>().ToList();
        }

        public Categoria? BuscarPorId(long id)
        {
            return _repository.ConsultarPorId<Categoria>(id);
        }

        public bool Atualizar(Categoria categoria, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            if (!Validar(categoria, out var mensagensValidacao))
            {
                mensagens.AddRange(mensagensValidacao);
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Salvar(categoria);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao atualizar categoria: {ex.Message}"));
                return false;
            }
        }

        public bool Excluir(long id, out List<MensagemErro> mensagens, bool forcar = false)
        {
            mensagens = new List<MensagemErro>();

            var categoria = _repository.ConsultarPorId<Categoria>(id);
            if (categoria == null)
            {
                mensagens.Add(new MensagemErro("Id", "Categoria não encontrada para exclusão."));
                return false;
            }

            if (!forcar)
            {
                if (categoria.Especies != null && categoria.Especies.Any())
                {
                    mensagens.Add(new MensagemErro("Especies", "Esta categoria possui espécies associadas. Use '?forcar=true' para excluir mesmo assim."));
                }

                if (categoria.Recinto != null)
                {
                    mensagens.Add(new MensagemErro("Recinto", "Esta categoria está vinculada a um recinto. Use '?forcar=true' para excluir mesmo assim."));
                }

                if (mensagens.Any())
                    return false;
            }

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

        private bool Validar(Categoria categoria, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();
            var contexto = new ValidationContext(categoria);
            var resultados = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(categoria, contexto, resultados, true);

            foreach (var resultado in resultados)
            {
                var campo = resultado.MemberNames.FirstOrDefault() ?? "";
                mensagens.Add(new MensagemErro(campo, resultado.ErrorMessage));
            }

            return valido;
        }
    }
}
