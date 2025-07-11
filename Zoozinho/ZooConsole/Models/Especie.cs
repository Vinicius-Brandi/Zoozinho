using System.Collections.Generic;
using ZooConsole.Enum;

namespace ZooConsole.Models
{
    public class Especie
    {
        public virtual long Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual Alimentacao Alimentacao { get; set; }
        public virtual Comportamento Comportamento { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual Habitat? Habitat { get; set; }
        public virtual IList<Animal> Animais { get; set; } = new List<Animal>();
    }
}



