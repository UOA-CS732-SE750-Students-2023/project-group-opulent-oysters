﻿using Microsoft.AspNetCore.Mvc;
using OpulentOysters.dtos;
using OpulentOysters.Enums;
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

        [HttpPost("SearchSong")]
        public async Task<IActionResult> SearchSong(string searchTerm, string roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            var response = await spotify.Search.Item(new SearchRequest(SearchRequest.Types.Track, searchTerm));
            return Ok(response.Tracks.Items?.Select(track => new Song(track.Id, track.Name, track.Explicit)).ToList());
        }

        [HttpPost("AddSong")]
        public async Task<IActionResult> AddSong(string trackId, string roomCode)
        {
            var accessToken = await _mongoDbService.GetTokenFromRoomId(roomCode);
            var spotify = new SpotifyClient(accessToken);
            var track = await spotify.Tracks.Get(trackId);
            var currentOrderNumber = await _mongoDbService.GetAndUpdateCurrentOrderNumber(roomCode);
            var song = new Song { Name = track.Name, IsExplicit = track.Explicit, SpotifyCode = track.Id, OrderAdded=currentOrderNumber };
            await _mongoDbService.AddSongToRoom(roomCode, song);
            return NoContent();
        }

        [HttpPost("UpvoteSong")]
        public async Task<IActionResult> UpvoteSong(string trackId, string roomCode, string userId)
        {
            var updateResult = await _mongoDbService.UpvoteSong(roomCode, trackId, userId);

            return updateResult switch
            {
                SongVoteResponse.SongNotFound => NotFound("Song not found"),
                SongVoteResponse.AlreadyLiked => Conflict("Song already liked"),
                _ => NoContent(),
            };
        }

        [HttpPost("DownvoteSong")]
        public async Task<IActionResult> DownvoteSong(string trackId, string roomCode, string userId)
        {
            var updateResult = await _mongoDbService.DownvoteSong(roomCode, trackId, userId);
            return updateResult switch
            {
                SongVoteResponse.SongNotFound => NotFound("Song not found"),
                SongVoteResponse.AlreadyDisliked => Conflict("Song already disliked"),
                _ => NoContent(),
            };
        }
    }
}
