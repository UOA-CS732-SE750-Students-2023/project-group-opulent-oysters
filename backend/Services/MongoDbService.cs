using OpulentOysters.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;

namespace OpulentOysters.Services;

public class MongoDbService
{

    private readonly IMongoCollection<Playlist> _playlistCollection;
    private readonly IMongoCollection<User> _userCollection;
    private readonly IMongoCollection<Models.Host> _hostCollection;
    private readonly IMongoCollection<Room> _roomCollection;
    private readonly IMongoCollection<RoomSettings> _roomSettingsCollection;

    public MongoDbService(IOptions<MongoDbSettings> mongoDbSettings)
    {
        MongoClient client = new MongoClient(mongoDbSettings.Value.ConnectionUri);
        IMongoDatabase database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
        _playlistCollection = database.GetCollection<Playlist>(mongoDbSettings.Value.PlaylistCollectionName);
        _userCollection = database.GetCollection<User>(mongoDbSettings.Value.UserCollectionName);
        _hostCollection = database.GetCollection<Models.Host>(mongoDbSettings.Value.HostCollectionName);
        _roomCollection = database.GetCollection<Room>(mongoDbSettings.Value.RoomCollectionName);
        _roomSettingsCollection = database.GetCollection<RoomSettings>(mongoDbSettings.Value.RoomSettingsCollectionName);
    }

    public async Task<List<Playlist>> GetAsync()
    {
        return await _playlistCollection.Find(new BsonDocument()).ToListAsync();
    }
    public async Task CreateAsync(Playlist playlist)
    {
        await _playlistCollection.InsertOneAsync(playlist);
    }
    public async Task AddToPlaylistAsync(string id, string movieId)
    {
        FilterDefinition<Playlist> filter = Builders<Playlist>.Filter.Eq("Id", id);
        UpdateDefinition<Playlist> update = Builders<Playlist>.Update.AddToSet<string>("movieIds", movieId);
        await _playlistCollection.UpdateOneAsync(filter, update);

    }
    public async Task DeleteAsync(string id)
    {
        FilterDefinition<Playlist> filter = Builders<Playlist>.Filter.Eq("Id", id);
        await _playlistCollection.DeleteOneAsync(filter);
        return;
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
}