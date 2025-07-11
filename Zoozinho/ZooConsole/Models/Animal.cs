using System;
using ZooConsole.Enum;

namespace ZooConsole.Models
{
    public class Animal
    {
        public virtual long Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual SexoAnimal Sexo { get; set; }
        public virtual int Idade { get; set; }
        public virtual decimal Peso { get; set; }

        public virtual long EspecieId { get; set; }
        public virtual Especie Especie { get; set; }

        public virtual long? HabitatId { get; set; }
        public virtual Habitat Habitat { get; set; }

        public virtual long? GalpaoId { get; set; }
        public virtual Galpao Galpao { get; set; }

        public virtual string Localizacao =>
            Galpao != null ? Galpao.Nome :
            Habitat != null ? Habitat.Nome : "Desconhecido";
    }
}
