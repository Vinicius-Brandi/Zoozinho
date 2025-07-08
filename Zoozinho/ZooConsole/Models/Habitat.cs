using System.Collections.Generic;

namespace ZooConsole.Models
{
    public class Habitat
    {
        public virtual long Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual long RecintoId { get; set; }
        public virtual Recinto Recinto { get; set; }
        public virtual long EspecieId { get; set; }
        public virtual Especie Especie { get; set; }
        public virtual int MaxCapacidade { get; set; }
        public virtual IList<Animal> Animais { get; set; } = new List<Animal>();
    }
}
