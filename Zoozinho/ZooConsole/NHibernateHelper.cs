using NHibernate;
using NHibernate.Cfg;
using System.Reflection;

namespace ZooConsole
{
    public static class NHibernateHelper
    {
        private static ISessionFactory _sessionFactory;

        public static ISessionFactory SessionFactory
        {
            get
            {
                if (_sessionFactory == null)
                {
                    var config = new Configuration();
                    config.Configure("hibernate.cfg.xml");
                    config.AddAssembly(Assembly.GetExecutingAssembly());

                    _sessionFactory = config.BuildSessionFactory();
                }

                return _sessionFactory;
            }
        }

        public static ISession AbrirSessao()
        {
            return SessionFactory.OpenSession();
        }
    }
}