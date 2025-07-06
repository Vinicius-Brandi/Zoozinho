using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ZooConsole.Models;
using ZooConsole.Repository;
using ZooConsole;

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
            var valido = Validar(categoria, out mensagens);
            if (!valido)
                return false;

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
                mensagens.Add(new MensagemErro("Exception", "Erro ao salvar categoria: " + ex.Message));
                return false;
            }
        }

        public bool Validar(Categoria categoria, out List<MensagemErro> mensagens)
        {
            var validationContext = new ValidationContext(categoria);
            var validationResults = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(categoria, validationContext, validationResults, true);

            mensagens = new List<MensagemErro>();

            foreach (var validationResult in validationResults)
            {
                var propriedade = validationResult.MemberNames.FirstOrDefault() ?? "";
                mensagens.Add(new MensagemErro(propriedade, validationResult.ErrorMessage));
            }

            if (string.IsNullOrWhiteSpace(categoria.Nome))
            {
                mensagens.Add(new MensagemErro("Nome", "O nome da categoria é obrigatório."));
                isValid = false;
            }

            return isValid;
        }
    }
}
