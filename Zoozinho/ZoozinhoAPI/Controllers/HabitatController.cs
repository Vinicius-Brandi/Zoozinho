using Microsoft.AspNetCore.Mvc;
using ZooConsole.DTOs;
using ZooConsole.DTOs.ZooConsole.DTOs.ZooConsole.DTOs;
using ZooConsole.Services;

namespace ZooAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabitatController : ControllerBase
    {
        private readonly HabitatService _servico;

        public HabitatController(HabitatService servico)
        {
            _servico = servico;
        }

        [HttpPost]
        public IActionResult Cadastrar([FromBody] HabitatDTO dto)
        {
            if (_servico.Cadastrar(dto, out var erros))
                return Ok(new { mensagem = "Habitat cadastrado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var habitats = _servico.Listar();
            return Ok(habitats);
        }

        [HttpGet("{id}")]
        public IActionResult BuscarPorId(long id)
        {
            var habitat = _servico.BuscarPorId(id);
            return habitat == null
                ? NotFound(new { erro = "Habitat não encontrada." })
                : Ok(habitat);
        }

        [HttpPut("{id:long}")]
        public IActionResult Atualizar(long id, [FromBody] HabitatDTO dto)
        {
            if (_servico.Atualizar(id, dto, out var erros))
                return Ok(new { mensagem = "Habitat atualizado com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id:long}")]
        public IActionResult Deletar(long id, [FromQuery] bool forcar = false)
        {
            if (_servico.Deletar(id, out var erros, forcar))
                return Ok(new { mensagem = "Habitat excluído com sucesso." });

            return UnprocessableEntity(erros);
        }
    }
}