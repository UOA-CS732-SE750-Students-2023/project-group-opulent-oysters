using Microsoft.AspNetCore.Mvc;
using OpulentOysters.dtos;
using OpulentOysters.Models;
using OpulentOysters.Services;
using SpotifyAPI.Web;

namespace OpulentOysters.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly MongoDbService _mongoDbService;

        public UserController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto)
        {
            User user = userDto.MapToUser();
            await _mongoDbService.CreateUser(user);
            return Ok(user);
        }

        [HttpPost("search-song")]
        public async Task<IActionResult> SearchSong(string searchTerm, int roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            var response = await spotify.Search.Item(new SearchRequest(SearchRequest.Types.Track, searchTerm));
            return Ok(response.Tracks.Items);
        }

        [HttpPost("add-song")]
        public async Task<IActionResult> AddSong(string trackId, int roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            var track = await spotify.Tracks.Get(trackId);
            var currentOrderNumber = await _mongoDbService.GetAndUpdateCurrentOrderNumber(roomCode);
            var song = new Song { Name = track.Name, IsExplicit = track.Explicit, SpotifyCode = track.Id, OrderAdded=currentOrderNumber };
            await _mongoDbService.AddSongToRoom(roomCode, song);
            return NoContent();
        }

        [HttpPost("upvote-song")]
        public async Task<IActionResult> UpvoteSong(string trackId, int roomCode)
        {
            var updateResult = await _mongoDbService.UpvoteSong(roomCode, trackId);
            if (String.Equals("failed", updateResult))
            {
                return NotFound("Song not found");
            }
            return NoContent();
        }

        [HttpPost("unupvote-song")]
        public async Task<IActionResult> UnupvoteSong(string trackId, int roomCode)
        {
            var updateResult = await _mongoDbService.UnupvoteSong(roomCode, trackId);
            if (String.Equals("failed", updateResult))
            {
                return NotFound("Song not found");
            }
            return NoContent();
        }
    }
}
