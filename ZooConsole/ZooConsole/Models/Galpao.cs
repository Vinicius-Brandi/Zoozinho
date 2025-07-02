using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Galpao
    {
        public int Id { get; set; }
        public string Nome { get; set; } = "Galpão Principal";
        public int CapacidadeMaxima { get; set; } = 10;
        public List<Animal> Animais { get; set; } = new List<Animal>();
    }
}
