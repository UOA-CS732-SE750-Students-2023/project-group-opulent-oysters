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
            
            var spotify = new SpotifyClient(response.AccessToken);
            host.Username = spotify.UserProfile.Current().Result.DisplayName;

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
        public async Task<IActionResult> RemoveSong(string roomCode, string trackId, string hostId)
        {
            var updateResult = await _mongoDbService.RemoveSongFromPlaylist(roomCode, trackId, hostId);
            if (updateResult)
            {
                return NoContent();
            }
            else
            {
                return Conflict();
            }
            
        }

        [HttpGet("NextSong")]
        public async Task<Song> NextSong(string roomCode, string hostId)
        {
            return await _mongoDbService.GetNextSong(roomCode, hostId);
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
           [HttpPost("PauseSong")]
        public async Task<IActionResult> PauseSong(string roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            await spotify.Player.PausePlayback();
            return NoContent();
        }

        [HttpPost("ResumeSong")]
        public async Task<IActionResult> ResumeSong(string roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            await spotify.Player.ResumePlayback();
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
            var roomId = await _mongoDbService.GetRoomId(roomCode);
            return Ok(roomId);
        }

        [HttpPost("UpdateExplicit")]
        public async Task<IActionResult> updateExplicit(string roomCode)
        {
            await _mongoDbService.updateExplicit(roomCode);
            return NoContent();
        }

        [HttpPost("UpdateApproval")]
        public async Task<IActionResult> updateApproval(string roomCode)
        {
            await _mongoDbService.updateApporval(roomCode);
            return NoContent();
        }

    }
}
