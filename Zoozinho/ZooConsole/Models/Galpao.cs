using System.Collections.Generic;

namespace ZooConsole.Models
{
    public class Galpao
    {
        public virtual long Id { get; set; }
        public virtual string Nome { get; set; } = "Galpão Principal";
        public virtual int CapacidadeMaxima { get; set; } = 10;
        public virtual IList<Animal> Animais { get; set; } = new List<Animal>();
    }
}
