using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Animal
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sexo { get; set; }
        public int Idade { get; set; }
        public decimal Peso { get; set; }

        public long EspecieId { get; set; }
        public Especie Especie { get; set; }

        public long? HabitatId { get; set; }
        public Habitat Habitat { get; set; }

        public long? GalpaoId { get; set; }
        public Galpao Galpao { get; set; }

        public string Localizacao =>
            Galpao != null ? Galpao.Nome :
            Habitat != null ? Habitat.Nome : "Desconhecido";
    }
}
