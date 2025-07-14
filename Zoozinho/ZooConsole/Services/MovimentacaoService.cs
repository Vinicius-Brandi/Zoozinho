using ZooConsole.Models;
using ZooConsole.Repository;
using ZooConsole.Enum;
using System;
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

        public List<Movimentacao> ListarPorAnimal(long animalId, int skip = 0, int pageSize = 10)
        {
            IQueryable<Movimentacao> query = _repository.Consultar<Movimentacao>()
                                             .Where(m => m.AnimalId == animalId)
                                             .OrderByDescending(m => m.DataHora);

            if (skip > 0)
                query = query.Skip(skip);

            if (pageSize > 0)
                query = query.Take(pageSize);

            return query.ToList();
        }
    }
}
