using Microsoft.AspNetCore.Mvc;
using ZooConsole.Models;
using ZooConsole.Services;
using ZooConsole.DTOs;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/categoria")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly CategoriaService _servico;

        public CategoriaController(CategoriaService servico)
        {
            _servico = servico;
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] CategoriaDTO dto)
        {
            if (_servico.Cadastrar(dto, out var erros))
                return Ok(dto);

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var categorias = _servico.Listar();
            return Ok(categorias);
        }

        [HttpGet("{id:long}")]
        public IActionResult BuscarPorId(long id)
        {
            var categoria = _servico.BuscarPorId(id);
            if (categoria == null)
                return NotFound(new { mensagem = "Categoria não encontrada." });

            return Ok(categoria);
        }

        [HttpPut]
        public IActionResult Atualizar([FromBody] Categoria categoria)
        {
            if (_servico.Atualizar(categoria, out var erros))
                return Ok(categoria);

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


