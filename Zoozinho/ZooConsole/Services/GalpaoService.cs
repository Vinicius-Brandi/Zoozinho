using System.ComponentModel.DataAnnotations;
using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Repository;

namespace ZooConsole.Services
{
    public class GalpaoService
    {
        private readonly IRepositorio _repository;
        private const int LIMITE_MAXIMO = 15;
        private const int LIMITE_AUMENTO = 5;

        public GalpaoService(IRepositorio repository)
        {
            _repository = repository;
        }

        public bool Cadastrar(GalpaoDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            if (_repository.Consultar<Galpao>().Any())
            {
                mensagens.Add(new MensagemErro("Galpao", "Já existe um galpão cadastrado. Não é possível criar outro."));
                return false;
            }

            if (dto.CapacidadeMaxima > LIMITE_MAXIMO)
            {
                mensagens.Add(new MensagemErro("CapacidadeMaxima", $"A capacidade máxima não pode ultrapassar {LIMITE_MAXIMO} animais."));
                return false;
            }

            var galpao = new Galpao
            {
                Nome = "Galpão Principal",
                CapacidadeMaxima = dto.CapacidadeMaxima
            };

            if (!Validar(galpao, mensagens))
                return false;

            return Salvar(galpao, mensagens, isNew: true);
        }

        public bool Atualizar(GalpaoDTO dto, out List<MensagemErro> mensagens)
        {
            mensagens = new List<MensagemErro>();

            var galpao = _repository.Consultar<Galpao>().FirstOrDefault();
            if (galpao == null)
            {
                mensagens.Add(new MensagemErro("Galpao", "Nenhum galpão encontrado para atualizar."));
                return false;
            }

            if (dto.CapacidadeMaxima <= galpao.CapacidadeMaxima)
            {
                mensagens.Add(new MensagemErro("CapacidadeMaxima", "Só é permitido aumentar a capacidade."));
                return false;
            }

            int aumento = dto.CapacidadeMaxima - galpao.CapacidadeMaxima;
            if (aumento > LIMITE_AUMENTO)
            {
                mensagens.Add(new MensagemErro("CapacidadeMaxima", $"O aumento máximo permitido é de {LIMITE_AUMENTO} unidades."));
                return false;
            }

            if (dto.CapacidadeMaxima > LIMITE_MAXIMO)
            {
                mensagens.Add(new MensagemErro("CapacidadeMaxima", $"A capacidade total não pode ultrapassar {LIMITE_MAXIMO} animais."));
                return false;
            }

            galpao.CapacidadeMaxima = dto.CapacidadeMaxima;

            if (!Validar(galpao, mensagens))
                return false;

            return Salvar(galpao, mensagens, isNew: false);
        }

        public Galpao? Mostrar()
        {
            return _repository.Consultar<Galpao>().FirstOrDefault();
        }

        public List<Animal> ListarAnimais()
        {
            var galpao = _repository.Consultar<Galpao>().FirstOrDefault();
            return galpao?.Animais?.ToList() ?? new List<Animal>();
        }

        private bool Validar(Galpao galpao, List<MensagemErro> mensagens)
        {
            var contexto = new ValidationContext(galpao);
            var resultados = new List<ValidationResult>();

            bool valido = Validator.TryValidateObject(galpao, contexto, resultados, true);

            mensagens.AddRange(resultados.Select(r =>
                new MensagemErro(r.MemberNames.FirstOrDefault() ?? "Desconhecido", r.ErrorMessage)));

            return valido;
        }

        private bool Salvar(Galpao galpao, List<MensagemErro> mensagens, bool isNew)
        {
            try
            {
                using var transacao = _repository.IniciarTransacao();

                if (isNew)
                    _repository.Incluir(galpao);
                else
                    _repository.Salvar(galpao);

                _repository.Commit();
                return true;
            }
            catch (Exception ex)
            {
                _repository.Rollback();
                mensagens.Add(new MensagemErro("Exception", $"Erro ao salvar galpão: {ex.Message}"));
                return false;
            }
        }
    }
}
