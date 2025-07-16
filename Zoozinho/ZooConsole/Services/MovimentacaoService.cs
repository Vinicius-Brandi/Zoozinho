using ZooConsole.Models;
using ZooConsole.Repository;
using ZooConsole.Enum;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ZooConsole.Services
{
    public class MovimentacaoService
    {
        private readonly IRepositorio _repository;

        public MovimentacaoService(IRepositorio repository)
        {
            _repository = repository;
        }

        public void RegistrarMovimentacao(
            Animal animal,
            Habitat origemHabitat,
            Galpao origemGalpao,
            Habitat destinoHabitat,
            Galpao destinoGalpao)
        {
            // Define origem somente se existir origemHabitat ou origemGalpao
            Localizacao? origem = null;
            if (origemHabitat != null)
                origem = Localizacao.Habitat;
            else if (origemGalpao != null)
                origem = Localizacao.Galpao;

            // Define destino, obrigatoriamente Habitat ou Galpao
            Localizacao destino = destinoHabitat != null ? Localizacao.Habitat : Localizacao.Galpao;

            var movimentacao = new Movimentacao
            {
                Animal = animal,
                AnimalId = animal.Id,
                DataHora = DateTime.Now,
                Origem = origem,
                OrigemHabitat = origemHabitat,
                OrigemHabitatId = origemHabitat?.Id,
                OrigemGalpao = origemGalpao,
                OrigemGalpaoId = origemGalpao?.Id,
                Destino = destino,
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
