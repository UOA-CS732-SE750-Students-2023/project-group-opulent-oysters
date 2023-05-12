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
        
        private async Task RefreshToken(string hostId)
        {
            Host host = await _mongoDbService.GetHost(hostId);

            var response = await new OAuthClient().RequestToken(
                new AuthorizationCodeRefreshRequest(
                    _spotifySettings.ClientID,
                    _spotifySettings.ClientSecret,
                    host.SpotifyRefreshToken
                )
            );

            host.SpotifyToken = response.AccessToken;

            if (host.Id == null)
            {
                return;
            }

            await _mongoDbService.UpdateHostToken(host.Id, host);
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
            host.SpotifyRefreshToken = response.RefreshToken;
            
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
            try
            {
                var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
                var spotify = new SpotifyClient(accessToken);
                var uris = new List<string>();
                uris.Add("spotify:track:" + trackId);
                await spotify.Player.ResumePlayback(new PlayerResumePlaybackRequest { Uris = uris });
            }
            catch (UnauthorizedAccessException e)
            {
                var room = await _mongoDbService.GetRoom(roomCode);
                await RefreshToken(room.OwnerId);
                await PlaySong(roomCode, trackId);
            }
            return NoContent();
        }
        

        [HttpGet("GetRoomId")]
        public async Task<IActionResult> GetRoomdId(string roomCode)
        {
            var roomId = await _mongoDbService.GetRoomId(roomCode);
            return Ok(roomId);
        }

        [HttpPost("UpdateExplicit")]
        public async Task<IActionResult> UpdateExplicit(string roomCode)
        {
            await _mongoDbService.UpdateExplicit(roomCode);
            return NoContent();
        }

        [HttpPost("UpdateApproval")]
        public async Task<IActionResult> UpdateApproval(string roomCode)
        {
            await _mongoDbService.UpdateApproval(roomCode);
            return NoContent();
        }

        [HttpPost("TransferPlayback")]
        public async Task<IActionResult> TransferPlayback([FromBody] TransferPlaybackDTO transferPlaybackDTO)
        {
            try
            {
                var accessToken = await _mongoDbService.GetTokenFromRoomId(transferPlaybackDTO.RoomCode);
                var spotify = new SpotifyClient(accessToken);
                var transferRequest = new PlayerTransferPlaybackRequest(transferPlaybackDTO.DeviceIds);
                await spotify.Player.TransferPlayback(transferRequest);
            }
            catch (UnauthorizedAccessException e)
            {
                var room = await _mongoDbService.GetRoom(transferPlaybackDTO.RoomCode);
                await RefreshToken(room.OwnerId);
                await TransferPlayback(transferPlaybackDTO);
            }
            return NoContent();
        }

        [HttpGet("IsExplicit")]
        public async Task<IActionResult> IsExplicit(string roomCode)
        {
            var result = await _mongoDbService.IsExplicit(roomCode);
            return Ok(result);
        }

    }
}
