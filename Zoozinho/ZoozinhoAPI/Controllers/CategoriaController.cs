using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using ZooConsole;
using ZooConsole.Models;
using ZooConsole.Services;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/categoria")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly CategoriaService servico;

        public CategoriaController(CategoriaService servico)
        {
            this.servico = servico;
        }

        [HttpPost]
        public IActionResult Post([FromBody] Categoria categoria)
        {
            if (servico.Cadastrar(categoria, out List<MensagemErro> erros))
            {
                return Ok(categoria);
            }
            return UnprocessableEntity(erros);
        }
    }
}

