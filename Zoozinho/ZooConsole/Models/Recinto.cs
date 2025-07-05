using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Recinto
    {
        public long Id { get; set; }
        public string Nome { set; get; }
        public long CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public int CapacidadeMaxHabitats { get; set; }
        public List<Habitat> Habitats { get; set; } = new List<Habitat>();

    }
}
