using OpulentOysters.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using OpulentOysters.Enums;
using Host = OpulentOysters.Models.Host;
using SpotifyAPI.Web;
using Microsoft.AspNetCore.Mvc;

namespace OpulentOysters.Services;

public class MongoDbService
{

    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Models.Host> _hostCollection;
    private readonly IMongoCollection<Room> _roomCollection;

    //For mocking purposes
    public MongoDbService()
    {

    }

    public MongoDbService(IOptions<MongoDbSettings> mongoDbSettings)
    {
        MongoClient client = new MongoClient(mongoDbSettings.Value.ConnectionUri);
        IMongoDatabase database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
        _userCollection = database.GetCollection<User>(mongoDbSettings.Value.UserCollectionName);
        _hostCollection = database.GetCollection<Models.Host>(mongoDbSettings.Value.HostCollectionName);
        _roomCollection = database.GetCollection<Room>(mongoDbSettings.Value.RoomCollectionName);
    }

    public async Task CreateUser(User user)
    {
        await _userCollection.InsertOneAsync(user);
    }

    public async Task<string> GetTokenFromRoomId(int roomCode)
    {
        var roomFilter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(roomFilter).FirstOrDefaultAsync();

        var roomOwnerUserFilter = Builders<Models.Host>.Filter.Eq("Id", room.OwnerId);
        var roomOwnerUser = await _hostCollection.Find(roomOwnerUserFilter).FirstOrDefaultAsync();
        return roomOwnerUser.SpotifyToken;
    }

    public async Task AddSongToRoom(int roomCode, Song song)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var update = Builders<Room>.Update.AddToSet<Song>("Queue", song);

        await _roomCollection.UpdateOneAsync(filter, update);
    }

    public async Task<int> GetAndUpdateCurrentOrderNumber(int roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        var update = Builders<Room>.Update.Set<int>("CurrentOrderNumber", room.CurrentOrderNumber + 1);
        await _roomCollection.UpdateOneAsync(filter, update);
        return room.CurrentOrderNumber + 1;
    }

    public async Task<SongVoteResponse> UpvoteSong(int roomCode, string trackId, string userId)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode) & Builders<Room>.Filter.ElemMatch(x => x.Queue, Builders<Song>.Filter.Eq(x => x.SpotifyCode, trackId));
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        var song = room.Queue.FirstOrDefault(x => x.SpotifyCode == trackId);
        var alreadyLiked = song?.LikedByUserId.FirstOrDefault(x => x == userId) != null;
        if (song == null || alreadyLiked)
        {
            return song == null ? SongVoteResponse.SongNotFound : SongVoteResponse.AlreadyLiked;
        } 
        
        
        var update = Builders<Room>.Update.Set("Queue.$.Likes", song.Likes + 1);
        var updateLikedList = Builders<Room>.Update.AddToSet("Queue.$.LikedByUserId", userId);
        await _roomCollection.UpdateOneAsync(filter, update);
        await _roomCollection.UpdateOneAsync(filter, updateLikedList);
        return SongVoteResponse.Success;
    }

    public async Task<SongVoteResponse> DownvoteSong(int roomCode, string trackId, string userId)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode) & Builders<Room>.Filter.ElemMatch(x => x.Queue, Builders<Song>.Filter.Eq(x => x.SpotifyCode, trackId));
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        var song = room.Queue.FirstOrDefault(x => x.SpotifyCode == trackId);
        var currentlyLiked = song?.LikedByUserId.FirstOrDefault(x => x == userId) != null;
        if (song == null || !currentlyLiked)
        {
            return song == null ? SongVoteResponse.SongNotFound : SongVoteResponse.AlreadyDisliked;
        }
        
        var update = Builders<Room>.Update.Set("Queue.$.Likes", song.Likes - 1);
        var updateLikedList = Builders<Room>.Update.Pull("Queue.$.LikedByUserId", userId);
        await _roomCollection.UpdateOneAsync(filter, update);
        await _roomCollection.UpdateOneAsync(filter, updateLikedList);
        return SongVoteResponse.Success;
        }

    //Start of Host functionality

    public virtual async Task CreateHost(Host host)
    {
        await _hostCollection.InsertOneAsync(host);
    }

    public virtual async Task CreateRoom(Room room)
    {
        await _roomCollection.InsertOneAsync(room);
    }

    public virtual async Task RemoveSongFromPlaylist(string roomCode, string songCode)
    {
        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var update = Builders<Room>.Update.PullFilter(room => room.Queue, Builders<Song>.Filter.Where(song => song.SpotifyCode == songCode));
        await _roomCollection.UpdateOneAsync(filter, update);
    }

    public async Task UpdateRoomSettings(Boolean allowExplicit, Boolean requireApproval, string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var update = Builders<Room>.Update.Set("RoomSetting.AllowExplicit", allowExplicit).Set("RoomSetting.RequireApproval", requireApproval);
        await _roomCollection.UpdateOneAsync(filter, update);
    }

    public async Task<Song> GetNextSong(string roomCode)
    {
        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();

       var nextSong = room.Queue.OrderByDescending(song => song.Likes).ThenBy(song => song.OrderAdded).FirstOrDefault();
        if(nextSong != null)
        {
            await RemoveSongFromPlaylist(roomCode, nextSong.SpotifyCode);
        }
        
        return nextSong;
    }

    public async Task<List<Song>> GetQueue(string roomCode)
    {
        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        return room.Queue.OrderByDescending(song => song.Likes).ThenBy(song => song.OrderAdded).ToList();
    }
}