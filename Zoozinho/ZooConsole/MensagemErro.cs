using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZooConsole
{
    public class MensagemErro
    {
        public MensagemErro(string propriedade, string mensagem)
        {
            this.propriedade = propriedade;
            this.mensagem = mensagem;
        }
        public string propriedade { get; set; }
        public string mensagem { get; set; }
    }
}
