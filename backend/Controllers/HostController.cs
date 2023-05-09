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
            
            // Gets access token from code
            var response = await new OAuthClient().RequestToken(
                new AuthorizationCodeTokenRequest(
                    _spotifySettings.ClientID, 
                    _spotifySettings.ClientSecret,
                    host.SpotifyToken, 
                    new Uri(_spotifySettings.RedirectURL))
            );

            host.SpotifyToken = response.AccessToken;

            await _mongoDbService.CreateHost(host);
            return Ok(host);
        }

        [HttpPost("CreateRoom")]
        public async Task<IActionResult> CreateRoom(string hostId)
        {
            var room = await _mongoDbService.CreateRoom(hostId);
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

        [HttpPost("PlaySong")]
        public async Task<IActionResult> PlaySong(string roomCode, string trackId)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            var uris = new List<string>();
            uris.Add("spotify:track:" + trackId);
            await spotify.Player.ResumePlayback(new PlayerResumePlaybackRequest { Uris = uris });
            return NoContent();
        }

        [HttpGet("GetSongState")]
        public async Task<SongState> GetSongState(string roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            CurrentlyPlayingContext currentPlaybackState = await spotify.Player.GetCurrentPlayback();
            var currentTime = currentPlaybackState.ProgressMs;
            var fullSong = currentPlaybackState.Item as FullTrack;
            return new SongState { CurrentTimeMilliseconds = currentTime, FullSongTimeMilliseconds = fullSong.DurationMs };
        }

        [HttpGet("GetRoomId")]
        public async Task<IActionResult> GetRoomdId(string roomCode)
        {
            var roomID = await _mongoDbService.GetRoomId(roomCode);
            return Ok(roomID);
        }

    }
}
