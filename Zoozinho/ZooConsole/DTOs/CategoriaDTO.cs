using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZooConsole.Models;

namespace ZooConsole.DTOs
{
    public class CategoriaDTO
    {
        public string Nome { get; set; }
    }

    public class CategoriaListagemDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public List<string> EspeciesNomes { get; set; }
        public RecintoResumoDTO Recinto { get; set; }
    }

}
