using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Especie
    {
        public virtual long Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual string Alimentacao { get; set; }
        public virtual string Comportamento { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual Habitat? Habitat { get; set; }
        public virtual List<Animal> Animais { get; set; } = new List<Animal>();
    }
}
