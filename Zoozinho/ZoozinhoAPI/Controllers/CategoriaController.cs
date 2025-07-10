using Microsoft.AspNetCore.Mvc;
using ZooConsole;
using ZooConsole.DTOs;
using ZooConsole.Services;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/[controller]")]
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
                return Ok(new { mensagem = "Categoria Cadastrada", dto});

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
        public IActionResult Atualizar(long id, [FromBody] CategoriaDTO dto)
        {
            if (_servico.Atualizar(id, dto, out List<MensagemErro> erros))
                return Ok(new {mensagem = "Categoria atualizada com Sucesso.", dto});

            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id:long}")]
        public IActionResult Deletar(long id, [FromQuery] bool forcar = false)
        {
            if (_servico.Deletar(id, out var erros, forcar))
                return Ok(new { mensagem = "Categoria excluída com sucesso." });

            return UnprocessableEntity(erros);
        }
    }
}