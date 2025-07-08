namespace ZooConsole.DTOs
{
    public class EspecieDTO
    {
        public string Nome { get; set; }
        public string Alimentacao { get; set; }
        public string Comportamento { get; set; }
        public long CategoriaId { get; set; }
    }

    public class EspecieRelatorioDTO
    {
        public string Categoria { get; set; }
        public int Quantidade { get; set; }
    }
}

