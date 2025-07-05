using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Especie
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Alimentacao { get; set; }
        public string Comportamento { get; set; }
        public long CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public List<Animal> Animais { get; set; } = new List<Animal>();
    }
}
