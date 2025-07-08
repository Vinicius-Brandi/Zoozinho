using Microsoft.AspNetCore.Mvc;
using ZooConsole.Models;
using ZooConsole.Services;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/recinto")]
    [ApiController]
    public class RecintoController : ControllerBase
    {
        private readonly RecintoService _servico;

        public RecintoController(RecintoService servico)
        {
            _servico = servico;
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var recintos = _servico.Listar();
            return Ok(recintos);
        }

        [HttpGet("{id:long}")]
        public IActionResult BuscarPorId(long id)
        {
            var recinto = _servico.BuscarPorId(id);
            if (recinto == null)
                return NotFound(new { mensagem = "Recinto não encontrado." });

            return Ok(recinto);
        }
    }
}

