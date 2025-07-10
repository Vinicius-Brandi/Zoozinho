namespace ZooConsole.DTOs
{
    public class HabitatDTO
    {
        public string Nome { get; set; }
        public long RecintoId { get; set; }
        public long EspecieId { get; set; }
        public int MaxCapacidade { get; set; }
    }

    public class HabitatListagemDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string RecintoNome { get; set; }
        public string EspecieNome { get; set; }
        public int MaxCapacidade { get; set; }
        public int AnimaisCount { get; set; }
    }
}

