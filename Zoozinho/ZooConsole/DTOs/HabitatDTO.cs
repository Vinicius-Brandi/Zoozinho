namespace ZooConsole.DTOs
{
    public class HabitatDTO
    {
        public string Nome { get; set; }
        public long RecintoId { get; set; }
        public long EspecieId { get; set; }
        public int MaxCapacidade { get; set; }
    }

    namespace ZooConsole.DTOs
    {
        namespace ZooConsole.DTOs
        {
            public class HabitatListagemDTO
            {
                public long Id { get; set; }
                public string Nome { get; set; }
                public long RecintoId { get; set; }
                public string RecintoNome { get; set; } = string.Empty;
                public long EspecieId { get; set; }
                public string EspecieNome { get; set; } = string.Empty;
                public int MaxCapacidade { get; set; }
                public List<string> AnimaisNomes { get; set; } = new();
            }

        }

    }
}

