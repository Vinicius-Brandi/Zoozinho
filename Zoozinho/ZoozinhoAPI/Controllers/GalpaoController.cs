using Microsoft.AspNetCore.Mvc;
using ZooConsole.DTOs;
using ZooConsole.Services;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalpaoController : ControllerBase
    {
        private readonly GalpaoService _servico;

        public GalpaoController(GalpaoService servico)
        {
            _servico = servico;
        }

        [HttpGet]
        public IActionResult Mostrar()
        {
            var galpao = _servico.Mostrar();
            if (galpao == null)
                return NotFound(new { mensagem = "Nenhum galpão cadastrado." });

            return Ok(galpao);
        }

        [HttpPut]
        public IActionResult Atualizar([FromBody] GalpaoDTO dto)
        {
            if (_servico.Atualizar(dto, out var erros))
                return Ok(new { mensagem = "Galpão atualizado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpGet("animais")]
        public IActionResult ListarAnimais()
        {
            var animais = _servico.ListarAnimais();
            return Ok(animais);
        }

        [HttpGet("relatorio")]
        public IActionResult Relatorio()
        {
            var relatorio = _servico.Relatorio();
            return Ok(relatorio);
        }

    }
}
