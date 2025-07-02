using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Especie
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Alimentacao { get; set; }
        public string Comportamento { get; set; }
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public List<Animal> Animais { get; set; } = new List<Animal>();
    }
}
