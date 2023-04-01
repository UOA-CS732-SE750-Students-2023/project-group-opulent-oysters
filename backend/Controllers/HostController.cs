using Microsoft.AspNetCore.Mvc;
using OpulentOysters.dtos;
using OpulentOysters.Models;
using OpulentOysters.Services;
using SpotifyAPI.Web;
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

        [HttpPost("CreateRoom")]
        public async Task<IActionResult> CreateRoom([FromBody] RoomDTO roomDTO, string hostId)
        {
            Room room = roomDTO.MapToRoom();
            room.OwnerId = hostId;
            await _mongoDbService.CreateRoom(room);
            return Ok(room);
        }

        [HttpDelete("RemoveSong")]
        public async Task<IActionResult> RemoveSong(string roomCode, string songCode)
        {
            await _mongoDbService.RemoveSongFromPlaylist(roomCode, songCode);
            return NoContent();
        }

        [HttpPost("UpdateRoomSettings")]
        public async Task<IActionResult> UpdateRoomSettings(Boolean allowExplicit, Boolean requireApproval, string roomCode)
        {
            await _mongoDbService.UpdateRoomSettings(allowExplicit, requireApproval, roomCode);
            return NoContent();
        }

        [HttpGet("NextSong")]
        public async Task<Song> NextSong(string roomCode)
        {
            return await _mongoDbService.GetNextSong(roomCode);
        }

        [HttpGet("GetQueue")]
        public async Task<List<Song>> GetQueue(string roomCode)
        {
            return await _mongoDbService.GetQueue(roomCode);
        }

    }
}
