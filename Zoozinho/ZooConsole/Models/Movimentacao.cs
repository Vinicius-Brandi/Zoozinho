using System;
using ZooConsole.Enum;

namespace ZooConsole.Models
{
    public class Movimentacao
    {
        public virtual long Id { get; set; }
        public virtual DateTime DataHora { get; set; } = DateTime.Now;

        public virtual long AnimalId { get; set; }
        public virtual Animal Animal { get; set; }

        public virtual Localizacao? Origem { get; set; }
        public virtual long? OrigemHabitatId { get; set; }
        public virtual Habitat OrigemHabitat { get; set; }

        public virtual long? OrigemGalpaoId { get; set; }
        public virtual Galpao OrigemGalpao { get; set; }

        public virtual Localizacao Destino { get; set; }
        public virtual long? DestinoHabitatId { get; set; }
        public virtual Habitat DestinoHabitat { get; set; }

        public virtual long? DestinoGalpaoId { get; set; }
        public virtual Galpao DestinoGalpao { get; set; }
    }
}


