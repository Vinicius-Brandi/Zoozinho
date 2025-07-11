using ZooConsole.Models;
using ZooConsole.Repository;
using ZooConsole.Enum;

namespace ZooConsole.Services
{
    public class MovimentacaoService
    {
        private readonly IRepositorio _repository;

        public MovimentacaoService(IRepositorio repository)
        {
            _repository = repository;
        }

        public void RegistrarMovimentacao(Animal animal, Habitat origemHabitat, Galpao origemGalpao, Habitat destinoHabitat, Galpao destinoGalpao)
        {
            var movimentacao = new Movimentacao
            {
                Animal = animal,
                AnimalId = animal.Id,
                DataHora = DateTime.Now,
                Origem = origemHabitat != null ? Localizacao.Habitat : Localizacao.Galpao,
                OrigemHabitat = origemHabitat,
                OrigemHabitatId = origemHabitat?.Id,
                OrigemGalpao = origemGalpao,
                OrigemGalpaoId = origemGalpao?.Id,
                Destino = destinoHabitat != null ? Localizacao.Habitat : Localizacao.Galpao,
                DestinoHabitat = destinoHabitat,
                DestinoHabitatId = destinoHabitat?.Id,
                DestinoGalpao = destinoGalpao,
                DestinoGalpaoId = destinoGalpao?.Id
            };

            using var transacao = _repository.IniciarTransacao();
            _repository.Incluir(movimentacao);
            _repository.Commit();
        }
    }
}
