using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Repository
{
    public interface IRepositorio
    {
        void Incluir(object model);
        void Salvar(object model);
        void Excluir(object model);
        T ConsultarPorId<T>(long id);
        IQueryable<T> Consultar<T>();

        IDisposable IniciarTransacao();
        void Commit();
        void Rollback();
    }

}
