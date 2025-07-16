namespace ZooConsole.DTOs
{
    public class EspecieDTO
    {
        public string Nome { get; set; }
        public int Alimentacao { get; set; }
        public int Comportamento { get; set; }
        public long CategoriaId { get; set; }
    }


    public class EspecieRelatorioDTO
    {
        public string Categoria { get; set; }
        public int Quantidade { get; set; }
    }

    public class EspecieListagemDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Alimentacao { get; set; }
        public string Comportamento { get; set; }
        public long CategoriaId { get; set; }
        public List<string> AnimaisNomes { get; set; }
        public string HabitatNome { get; set; }
    }

}

