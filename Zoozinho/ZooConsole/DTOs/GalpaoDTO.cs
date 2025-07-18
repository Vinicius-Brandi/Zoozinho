namespace ZooConsole.DTOs
{
    public class GalpaoDTO
    {
        public int CapacidadeMaxima { get; set; }
    }

    public class GalpaoRelatorioDTO
    {
        public int TotalAnimais { get; set; }
        public List<EspecieQuantidadeDTO> Especies { get; set; } = new();
    }

    public class EspecieQuantidadeDTO
    {
        public long EspecieId { get; set; }
        public string EspecieNome { get; set; }
        public int Quantidade { get; set; }
    }
}
