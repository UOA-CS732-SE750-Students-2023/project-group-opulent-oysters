using Microsoft.AspNetCore.Mvc;
using OpulentOysters.dtos;
using OpulentOysters.Models;
using OpulentOysters.Services;
using Host = OpulentOysters.Models.Host;

namespace OpulentOysters.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HostController : ControllerBase
    {

        private readonly MongoDbService _mongoDbService;

        public HostController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        // POST api/<HostController>
        [HttpPost]
        public async Task<IActionResult> CreateHost([FromBody] HostDTO hostDTO)
        {
            Host host = hostDTO.MapToUser();
            await _mongoDbService.CreateHost(host);
            return Ok(host);
        }

    }
}
