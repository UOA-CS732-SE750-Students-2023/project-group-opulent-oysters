namespace OpulentOysters.Models;

public class MongoDBSettings
{

    public string ConnectionURI { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string PlaylistCollectionName { get; set; } = null!;
    public string UserCollectionName { get; set; } = null!;
    public string HostCollectionName { get; set; } = null!;
    public string RoomCollectionName { get; set; } = null!;
    public string RoomSettingsCollectionName { get; set; } = null!;
}