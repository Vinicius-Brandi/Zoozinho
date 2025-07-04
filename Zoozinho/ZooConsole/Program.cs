using System;
using ZooConsole.Models;
using NHibernate;

namespace ZooConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var categoria = new Categoria
            {
                Nome = "Testando NHibernate"
            };

            using (ISession session = NHibernateHelper.AbrirSessao())
            using (ITransaction tx = session.BeginTransaction())
            {
                session.Save(categoria);
                tx.Commit();
            }

            Console.WriteLine("Categoria salva com sucesso! ID: " + categoria.Id);
        }
    }
}