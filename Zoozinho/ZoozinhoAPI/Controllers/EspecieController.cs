using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ZooConsole.DTOs;
using ZooConsole.Models;
using ZooConsole.Services;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/especie")]
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
            var especie = new Especie
            {
                Nome = dto.Nome,
                Alimentacao = dto.Alimentacao,
                Comportamento = dto.Comportamento,
                Categoria = new Categoria { Id = dto.CategoriaId }
            };

            if (_servico.Cadastrar(especie, out var erros))
                return Ok(especie);

            return UnprocessableEntity(erros);
        }


        [HttpGet]
        public IActionResult Listar()
        {
            var especies = _servico.Listar();
            return Ok(especies);
        }

        [HttpGet("{id:long}")]
        public IActionResult BuscarPorId(long id)
        {
            var especie = _servico.BuscarPorId(id);
            if (especie == null)
                return NotFound(new { mensagem = "Espécie não encontrada." });
            return Ok(especie);
        }

        [HttpPut]
        public IActionResult Atualizar([FromBody] Especie especie)
        {
            if (_servico.Atualizar(especie, out var erros))
                return Ok(especie);
            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id:long}")]
        public IActionResult Excluir(long id, [FromQuery] bool forcar = false) 
        {
            if (_servico.Excluir(id, out var erros, forcar))
                return NoContent();

            return UnprocessableEntity(erros);
        }
    }
}
