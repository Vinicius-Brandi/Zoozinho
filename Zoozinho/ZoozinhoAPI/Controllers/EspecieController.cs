using Microsoft.AspNetCore.Mvc;
using ZooConsole.DTOs;
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
            if (_servico.Cadastrar(dto, out var erros))
                return Ok(new { mensagem = "Espécie cadastrada com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var especies = _servico.Listar();
            return Ok(especies);
        }

        [HttpGet("{id}")]
        public IActionResult BuscarPorId(long id)
        {
            var especie = _servico.BuscarPorId(id);
            return especie == null
                ? NotFound(new { erro = "Espécie não encontrada." })
                : Ok(especie);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(long id, [FromBody] EspecieDTO dto)
        {
            if (_servico.Atualizar(id, dto, out var erros))
                return Ok(new { mensagem = "Espécie atualizada com sucesso.", dto });

            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(long id, [FromQuery] bool forcar = false)
        {
            if (_servico.Deletar(id, out var erros, forcar))
                return Ok(new { mensagem = "Espécie excluída com sucesso." });

            return UnprocessableEntity(erros);
        }


        [HttpGet("relatorio")]
        public IActionResult Relatorio()
        {
            var relatorio = _servico.RelatorioPorCategoria();
            return Ok(relatorio);
        }
    }
}