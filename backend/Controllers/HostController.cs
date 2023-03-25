﻿using Microsoft.AspNetCore.Mvc;
using OpulentOysters.Services;

namespace OpulentOysters.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HostController : ControllerBase
    {

        private readonly MongoDbService _mongoDBService;

        public HostController(MongoDbService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        // GET: api/<HostController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<HostController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<HostController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<HostController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<HostController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
