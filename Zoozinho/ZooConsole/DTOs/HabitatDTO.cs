using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.DTOs
{
    public class HabitatDTO
    {
        public string Nome { get; set; }
        public long RecintoId { get; set; }
        public long EspecieId { get; set; }
        public int MaxCapacidade { get; set; }
    }
    public class HabitatResumoDTO
    {
    }
}
