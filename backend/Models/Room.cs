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

    }
}
