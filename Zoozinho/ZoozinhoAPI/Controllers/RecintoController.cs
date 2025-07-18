using Microsoft.AspNetCore.Mvc;
using ZooConsole.DTOs;
using ZooConsole.Services;

namespace ZooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecintoController : ControllerBase
    {
        private readonly RecintoService _servico;

        public RecintoController(RecintoService servico)
        {
            _servico = servico;
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] RecintoDTO dto)
        {
            if (_servico.Cadastrar(dto, out var erros))
                return Ok(new { mensagem = "Recinto cadastrado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Listar([FromQuery] int skip = 0, [FromQuery] int pageSize = 6)
        {
            var lista = _servico.Listar(skip, pageSize);
            return Ok(lista);
        }

        [HttpGet("{id:long}")]
        public IActionResult BuscarPorId(long id)
        {
            var recinto = _servico.BuscarPorId(id);
            return recinto == null
                ? NotFound(new { mensagem = "Recinto não encontrado." })
                : Ok(recinto);
        }

        [HttpGet("{id}/relatorio")]
        public ActionResult<RecintoRelatorioDTO> Relatorio(long id)
        {
            var resultado = _servico.Relatorio(id);
            return Ok(resultado);
        }

        [HttpPut("{id:long}")]
        public IActionResult Atualizar(long id, [FromBody] RecintoDTO dto)
        {
            if (_servico.Atualizar(id, dto, out var erros))
                return Ok(new { mensagem = "Recinto atualizado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id:long}")]
        public IActionResult Deletar(long id, [FromQuery] bool forcar = false)
        {
            if (_servico.Deletar(id, out var erros, forcar))
                return Ok(new { mensagem = "Recinto excluído com sucesso." });

            return UnprocessableEntity(erros);
        }
    }
}