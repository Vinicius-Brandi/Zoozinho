using Microsoft.AspNetCore.Mvc;
using ZooConsole.DTOs;
using ZooConsole.Services;

namespace ZoozinhoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalController : ControllerBase
    {
        private readonly AnimalService _servico;

        public AnimalController(AnimalService servico)
        {
            _servico = servico;
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] AnimalDTO dto)
        {
            if (_servico.Cadastrar(dto, out var erros))
                return Ok(new { mensagem = "Animal cadastrado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var lista = _servico.Listar();
            return Ok(lista);
        }

        [HttpGet("{id:long}")]
        public IActionResult BuscarPorId(long id)
        {
            var animal = _servico.BuscarPorId(id);
            if (animal == null)
                return NotFound(new { mensagem = "Animal não encontrado." });

            return Ok(animal);
        }

        [HttpPut("{id:long}")]
        public IActionResult Atualizar(long id, [FromBody] AnimalDTO dto)
        {
            if (_servico.Atualizar(id, dto, out var erros))
                return Ok(new { mensagem = "Animal atualizado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id:long}")]
        public IActionResult Deletar(long id, [FromQuery] bool forcar = false)
        {
            if (_servico.Deletar(id, out var erros, forcar))
                return Ok(new { mensagem = "Animal excluído com sucesso." });

            return UnprocessableEntity(erros);
        }
    }
}
