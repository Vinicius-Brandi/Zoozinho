using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole.Models
{
    public enum Localizacao
    {
        Galpao,
        Habitat
    }
    public class Movimentacao
    {
        public int Id { get; set; }
        public DateTime DataHora { get; set; } = DateTime.Now;
        public int AnimalId { get; set; }
        public Animal Animal { get; set; }

        public Localizacao Origem { get; set; }
        public int? OrigemHabitatId { get; set; }
        public Habitat OrigemHabitat { get; set; }
        public int? OrigemGalpaoId { get; set; }
        public Galpao OrigemGalpao { get; set; }

        public Localizacao Destino { get; set; }
        public int? DestinoHabitatId { get; set; }
        public Habitat DestinoHabitat { get; set; }
        public int? DestinoGalpaoId { get; set; }
        public Galpao DestinoGalpao { get; set; }


    }
}
