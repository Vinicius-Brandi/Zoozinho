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
        public IActionResult Listar([FromQuery] int skip = 0, [FromQuery] int pageSize = 6)
        {
            var lista = _servico.Listar(skip, pageSize);
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

        [HttpGet("{id:long}/movimentacoes")]
        public IActionResult ListarMovimentacoes(long id, [FromQuery] int skip = 0, [FromQuery] int pageSize = 10)
        {
            var movimentacoes = _servico.ListarMovimentacoes(id, skip, pageSize);
            return Ok(movimentacoes);
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
