using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public List<Especie> Especies { get; set; } = new List<Especie>();
        public List<Recinto> Recintos { get; set; } = new List<Recinto>();
    }
}
