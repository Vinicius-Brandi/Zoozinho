using System.Collections.Generic;

namespace ZooConsole.Models
{
    public class Recinto
    {
        public virtual long Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual long CategoriaId { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual int CapacidadeMaxHabitats { get; set; }
        public virtual IList<Habitat> Habitats { get; set; } = new List<Habitat>();
    }
}

