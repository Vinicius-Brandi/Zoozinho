using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Habitat
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public long RecintoId { get; set; }
        public Recinto Recinto { get; set; }
        public long EspecieId { get; set; }
        public Especie Especie { get; set; }
        public int MaxCapacidade { get; set; }
        public List<Animal> Animais { get; set; } = new List<Animal>();

    }
}
