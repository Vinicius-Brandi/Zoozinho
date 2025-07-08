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
        private readonly EspecieService _service;

        public EspecieController(EspecieService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult Post([FromBody] EspecieDTO dto)
        {
            if (_service.Cadastrar(dto, out List<MensagemErro> erros))
                return Ok(dto);

            // ADICIONE ISSO TEMPORARIAMENTE:
            Console.WriteLine("Erros encontrados:");
            foreach (var erro in erros)
            {
                Console.WriteLine($"- {erro.Propriedade}: {erro.Mensagem}");
            }

            return UnprocessableEntity(erros);
        }

        [HttpGet]
        public IActionResult Get(string pesquisa = "")
        {
            var especies = string.IsNullOrWhiteSpace(pesquisa)
                ? _service.Consultar()
                : _service.Consultar(pesquisa);

            return Ok(especies);
        }


        [HttpPut("{id}")]
        public IActionResult Put(long id, [FromBody] EspecieDTO dto)
        {
            if (_service.Atualizar(id, dto, out List<MensagemErro> erros))
                return Ok(dto);

            return UnprocessableEntity(erros);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var excluida = _service.Deletar(id);
            if (excluida == null)
                return BadRequest(new { erro = "Não é possível excluir: espécie vinculada a habitat ou animais." });

            return Ok(excluida);
        }

        [HttpGet("relatorio")]
        public IActionResult Relatorio()
        {
            var relatorio = _service.RelatorioPorCategoria();
            return Ok(relatorio);
        }
    }
}


