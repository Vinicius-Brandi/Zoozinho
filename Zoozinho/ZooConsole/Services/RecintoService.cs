using System.Collections.Generic;
using System.Linq;
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

        public List<Recinto> Listar()
        {
            return _repository.Consultar<Recinto>().ToList();
        }

        public Recinto? BuscarPorId(long id)
        {
            return _repository.ConsultarPorId<Recinto>(id);
        }
    }
}

