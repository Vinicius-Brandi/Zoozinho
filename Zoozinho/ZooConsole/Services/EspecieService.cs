using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ZooConsole.Models;
using ZooConsole.Repository;

namespace ZooConsole.Services
{
    public class EspecieService
    {
        private readonly IRepositorio _repository;

        public EspecieService(IRepositorio repository)
        {
            _repository = repository;
        }

        public bool Cadastrar(Especie especie, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            if (!Validar(especie, out var mensagensValidacao))
            {
                mensagens.AddRange(mensagensValidacao);
                return false;
            }

            especie.Categoria = _repository.ConsultarPorId<Categoria>(especie.Categoria.Id);
            if (especie.Categoria == null)
            {
                mensagens.Add(new MensagemErro("Categoria.Id", "Categoria informada não existe."));
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Incluir(especie);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao salvar espécie: {ex.Message}"));
                return false;
            }
        }

        public List<Especie> Listar()
        {
            return _repository.Consultar<Especie>().ToList();
        }

        public Especie? BuscarPorId(long id)
        {
            return _repository.ConsultarPorId<Especie>(id);
        }

        public bool Atualizar(Especie especie, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            if (!Validar(especie, out var mensagensValidacao))
            {
                mensagens.AddRange(mensagensValidacao);
                return false;
            }

            especie.Categoria = _repository.ConsultarPorId<Categoria>(especie.Categoria.Id);
            if (especie.Categoria == null)
            {
                mensagens.Add(new MensagemErro("Categoria.Id", "Categoria informada não existe."));
                return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();
                _repository.Salvar(especie);
                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao atualizar espécie: {ex.Message}"));
                return false;
            }
        }

        public bool Excluir(long id, out List<MensagemErro> mensagens, bool forcar = false)
        {
            mensagens = new List<MensagemErro>();

            var especie = _repository.ConsultarPorId<Especie>(id);
            if (especie == null)
            {
                mensagens.Add(new MensagemErro("Id", "Espécie não encontrada para exclusão."));
                return false;
            }

            var habitat = _repository.Consultar<Habitat>().FirstOrDefault(h => h.Especie.Id == id);
            if (!forcar)
            {
                if (especie.Animais.Any())
                {
                    mensagens.Add(new MensagemErro("Animais", "Esta espécie possui animais associados. Exclua ou remova os animais antes de continuar."));
                }

                if (habitat != null)
                {
                    mensagens.Add(new MensagemErro("Habitat", "Esta espécie está vinculada a um habitat. Exclua ou remova o habitat antes de continuar."));
                }

                if (mensagens.Any())
                    return false;
            }

            try
            {
                using var transacao = _repository.IniciarTransacao();

                if (habitat != null)
                    _repository.Excluir(habitat);

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

        private bool Validar(Especie especie, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();
            var contexto = new ValidationContext(especie);
            var resultados = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(especie, contexto, resultados, true);

            foreach (var resultado in resultados)
            {
                var campo = resultado.MemberNames.FirstOrDefault() ?? "";
                mensagens.Add(new MensagemErro(campo, resultado.ErrorMessage));
            }

            if (string.IsNullOrWhiteSpace(especie.Nome))
            {
                mensagens.Add(new MensagemErro("Nome", "O nome da espécie é obrigatório."));
                valido = false;
            }

            if (especie.Categoria == null || especie.Categoria.Id <= 0)
            {
                mensagens.Add(new MensagemErro("Categoria.Id", "É obrigatório informar uma categoria para a espécie."));
                valido = false;
            }

            return valido;
        }
    }
}

