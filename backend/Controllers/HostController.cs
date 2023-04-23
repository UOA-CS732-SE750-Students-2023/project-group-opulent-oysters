using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
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
        private readonly SpotifySettings _spotifySettings;

        public HostController(MongoDbService mongoDbService, IOptions<SpotifySettings> spotifySettings)
        {
            _mongoDbService = mongoDbService;
            _spotifySettings = spotifySettings.Value;
        }

        // POST api/<HostController>
        [HttpPost]
        public async Task<IActionResult> CreateHost([FromBody] HostDTO hostDTO)
        {
            Host host = hostDTO.MapToUser();
            
            Console.WriteLine(new Uri(_spotifySettings.RedirectURL).ToString());
            
            // Gets access token from code
            var response = await new OAuthClient().RequestToken(
                new AuthorizationCodeTokenRequest(
                    _spotifySettings.ClientID, 
                    _spotifySettings.ClientSecret, 
                    "AQBrebMLTvC5E02cUOJq40KMDxrFsXgEaQu9HZXazNX1ofLkyENL1VmJvkyikdsUOhZouCy2EeaHF2EmeNZg2Kg1BkwbasjrW3brZD1XUHEpsqz9ta2_3R8XWITkoOf_AZ0_bVTSn0ifC_37NQHLPZvvEmUjZxOpMEN", 
                    new Uri(_spotifySettings.RedirectURL))
            );

            Console.WriteLine(response.AccessToken);
            host.SpotifyToken = response.AccessToken;

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
