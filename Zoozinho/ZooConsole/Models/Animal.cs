using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public class Animal
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Sexo { get; set; }
        public int Idade { get; set; }
        public double Peso { get; set; }

        public int EspecieId { get; set; }
        public Especie Especie { get; set; }

        public int? HabitatId { get; set; }
        public Habitat Habitat { get; set; }

        public int? GalpaoId { get; set; }
        public Galpao Galpao { get; set; }

        public string Localizacao =>
            Galpao != null ? Galpao.Nome :
            Habitat != null ? Habitat.Nome : "Desconhecido";
    }
}
