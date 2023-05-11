using OpulentOysters.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using OpulentOysters.Enums;
using Host = OpulentOysters.Models.Host;
using SpotifyAPI.Web;
using Microsoft.AspNetCore.Mvc;
using OpulentOysters.dtos;

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

    public virtual async Task CreateUser(User user)
    {
        await _userCollection.InsertOneAsync(user);
    }

    public virtual async Task<string> GetTokenFromRoomId(string roomCode)
    {
        var roomFilter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(roomFilter).FirstOrDefaultAsync();

        var roomOwnerUserFilter = Builders<Models.Host>.Filter.Eq("Id", room.OwnerId);
        var roomOwnerUser = await _hostCollection.Find(roomOwnerUserFilter).FirstOrDefaultAsync();
        return roomOwnerUser.SpotifyToken;
    }

    public virtual async Task AddSongToRoom(string roomCode, Song song)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var update = Builders<Room>.Update.AddToSet<Song>("Queue", song);

        await _roomCollection.UpdateOneAsync(filter, update);
    }

    public virtual async Task<int> GetAndUpdateCurrentOrderNumber(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        var update = Builders<Room>.Update.Set<int>("CurrentOrderNumber", room.CurrentOrderNumber + 1);
        await _roomCollection.UpdateOneAsync(filter, update);
        return room.CurrentOrderNumber + 1;
    }

    public virtual async Task<SongVoteResponse> UpvoteSong(string roomCode, string trackId, string userId)
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

    public virtual async Task<SongVoteResponse> DownvoteSong(string roomCode, string trackId, string userId)
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

    public virtual async Task<CreateUserResponse> JoinRoom(string id, string username, string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();

        var tempUser = room.Users.FirstOrDefault(x => x.Username == username);
        if (tempUser != null)
        {
            return CreateUserResponse.UsernameAlreadyTaken;
        }

        var update = Builders<Room>.Update.AddToSet<User>("Users", new User {Id = id, Username = username});
        await _roomCollection.UpdateOneAsync(filter, update);

        return CreateUserResponse.Success;
    }

    public virtual async Task<CreateUserResponse> CheckCode(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        if (room == null)
        {
            return CreateUserResponse.RoomDoesntExist;
        }
        return CreateUserResponse.Success;
    }
    
    public virtual async Task<RoomDTO> GetRoom(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        if (room == null)
        {
            return null;
        }

        var roomDTO = room.MapToRoomDTO();
        var hostFilter = Builders<Host>.Filter.Eq("Id", room.OwnerId);
        var host = await _hostCollection.Find(hostFilter).FirstOrDefaultAsync();

        roomDTO.OwnerName = host.Username;
        
        return roomDTO;
    }

    public virtual async Task<bool> CheckExplicit(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        if (room.RoomSetting.AllowExplicit)
        {
            return true;
        }
        return false;
    }

    //Start of Host functionality

    public virtual async Task CreateHost(Host host)
    {
        await _hostCollection.InsertOneAsync(host);
    }

    public virtual async Task<Room> CreateRoom(string hostId)
    {
        Random random = new Random();
        string roomCode = random.Next(0, 1000000).ToString("D6");
        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var existingRoom = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        while (existingRoom != null)
        {
            roomCode = random.Next(0, 1000000).ToString("D6");
            filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
            existingRoom = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        }
        Room newRoom = new Room { OwnerId = hostId, Code = roomCode, RoomSetting = new RoomSetting() };
        await _roomCollection.InsertOneAsync(newRoom);
        return newRoom;
    }

    public virtual async Task<Boolean> RemoveSongFromPlaylist(string roomCode, string trackId, string hostId)
    {

        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        if(hostId != room.OwnerId)
        {
            return false;
        }

        var update = Builders<Room>.Update.PullFilter(room => room.Queue, Builders<Song>.Filter.Where(song => song.SpotifyCode == trackId));
        await _roomCollection.UpdateOneAsync(filter, update);
        return true;
    }

    public virtual async Task<Song> GetNextSong(string roomCode, string hostId)
    {
        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();

       var nextSong = room.Queue.OrderByDescending(song => song.Likes).ThenBy(song => song.OrderAdded).FirstOrDefault();
        if(nextSong != null)
        {
            await RemoveSongFromPlaylist(roomCode, nextSong.SpotifyCode, hostId);
        }
        
        return nextSong;
    }

    public virtual async Task<List<Song>> GetQueue(string roomCode)
    {
        var filter = Builders<Room>.Filter.Where(room => room.Code == roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        return room.Queue.OrderByDescending(song => song.Likes).ThenBy(song => song.OrderAdded).ToList();
    }
    public virtual async Task<string> GetRoomId(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        return room.Id;
    }

    public virtual async Task UpdateExplicit(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        var update = Builders<Room>.Update.Set("RoomSetting.AllowExplicit", !room.RoomSetting.AllowExplicit);
        await _roomCollection.UpdateOneAsync(filter, update);
    }

    public virtual async Task UpdateApporval(string roomCode)
    {
        var filter = Builders<Room>.Filter.Eq("Code", roomCode);
        var room = await _roomCollection.Find(filter).FirstOrDefaultAsync();
        var update = Builders<Room>.Update.Set("RoomSetting.RequireApproval", !room.RoomSetting.RequireApproval);
        await _roomCollection.UpdateOneAsync(filter, update);
    }
}