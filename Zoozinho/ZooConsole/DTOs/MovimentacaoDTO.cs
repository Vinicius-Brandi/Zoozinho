using ZooConsole.Enum;

namespace ZooConsole.DTOs
{
    public class MovimentacaoDTO
    {
        public long Id { get; set; }
        public DateTime DataHora { get; set; }
        public Localizacao Origem { get; set; }
        public string OrigemHabitatNome { get; set; }
        public string OrigemGalpaoNome { get; set; }
        public Localizacao Destino { get; set; }
        public string DestinoHabitatNome { get; set; }
        public string DestinoGalpaoNome { get; set; }
    }
}
