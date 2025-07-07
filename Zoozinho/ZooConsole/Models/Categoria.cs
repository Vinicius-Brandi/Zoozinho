using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
namespace ZooConsole.Models
{
    public class Categoria
    {
        public virtual long Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        public virtual string Nome { get; set; }

        public virtual IList<Especie> Especies { get; set; } = new List<Especie>();

        public virtual Recinto? Recinto { get; set; }
    }
}
