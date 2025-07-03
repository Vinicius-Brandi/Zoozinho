using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Categoria
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Nome { get; set; }
        public List<Especie> Especies { get; set; } = new List<Especie>();
        public List<Recinto> Recintos { get; set; } = new List<Recinto>();
    }
}
