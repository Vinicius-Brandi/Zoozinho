using ZooConsole.Enum;

namespace ZooConsole.DTOs
{
    public class AnimalDTO
    {
        public string Nome { get; set; }
        public SexoAnimal Sexo { get; set; }
        public int Idade { get; set; }
        public decimal Peso { get; set; }
        public long EspecieId { get; set; }
        public long? HabitatId { get; set; }
        public long? GalpaoId { get; set; }
    }

    public class AnimalListagemDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sexo { get; set; }
        public int Idade { get; set; }
        public decimal Peso { get; set; }

        public long EspecieId { get; set; }
        public string EspecieNome { get; set; }

        public long? HabitatId { get; set; }
        public string HabitatNome { get; set; }

        public long? GalpaoId { get; set; }
        public string GalpaoNome { get; set; }

        public string Localizacao { get; set; }
    }

    public class TotalItens<T>
    {
        public int Total { get; set; }
        public List<T> Itens { get; set; }
    }

}
