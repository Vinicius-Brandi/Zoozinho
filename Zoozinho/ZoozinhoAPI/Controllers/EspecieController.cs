using Microsoft.AspNetCore.Mvc;
using ZooConsole;
using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Services;

namespace ZooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EspecieController : ControllerBase
    {
        private readonly EspecieService _servico;

        public EspecieController(EspecieService servico)
        {
            _servico = servico;
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] EspecieDTO dto)
        {
            if (_servico.Cadastrar(dto, out List<MensagemErro> erros))
                return Ok(dto);

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var especies = _servico.Listar();
            return Ok(especies);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(long id, [FromBody] EspecieDTO dto)
        {
            if (_servico.Atualizar(id, dto, out List<MensagemErro> erros))
                return Ok(dto);

            return UnprocessableEntity(erros);
        }

        [HttpGet("{id}")]
        public IActionResult BuscarPorId(long id)
        {
            var especie = _servico.BuscarPorId(id);
            if (especie == null)
                return NotFound(new { mensagem = "Espécie não encontrada." });

            return Ok(especie);
        }

        [HttpDelete("{id}")]
        public IActionResult Excluir(long id)
        {
            var excluida = _servico.Deletar(id);
            if (excluida == null)
                return BadRequest(new { erro = "Não é possível excluir: espécie vinculada a habitat ou animais." });

            return Ok(excluida);
        }

        [HttpGet("relatorio")]
        public IActionResult Relatorio()
        {
            var relatorio = _servico.RelatorioPorCategoria();
            return Ok(relatorio);
        }
    }
}


