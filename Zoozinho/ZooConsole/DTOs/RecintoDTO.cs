using ZooConsole.DTOs;

namespace ZooConsole.DTOs
{
    public class RecintoDTO
    {
        public string Nome { get; set; }
        public long CategoriaId { get; set; }
        public int CapacidadeMaxHabitats { get; set; }
    }
    public class RecintoListagemDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public long CategoriaId { get; set; }
        public string CategoriaNome { get; set; }
        public int CapacidadeMaxHabitats { get; set; }
    }
    public class RecintoResumoDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public int CapacidadeMaxHabitats { get; set; }
    }

    public class RecintoRelatorioDTO
    {
        public string NomeRecinto { get; set; }
        public string Categoria { get; set; }
        public int TotalAnimais { get; set; }
        public List<EspecieQuantidadeDTO> Especies { get; set; }
    }


}
