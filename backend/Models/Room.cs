using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace OpulentOysters.Models
{
    public class Room
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string OwnerId { get; set; } = null!;
        public string Code { get; set; } = null!;
        public List<Song> Queue { get; set; } = new List<Song>();
        public int CurrentOrderNumber { get; set; } = 0!;
        public RoomSetting RoomSetting { get; set; } = null!;
        public List<User> Users { get; set; } = new List<User>();
    }
}
