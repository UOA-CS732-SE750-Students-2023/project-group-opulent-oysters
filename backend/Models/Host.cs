using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace OpulentOysters.Models
{
    public class Host
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Username { get; set; } = null!;

        public string SpotifyToken { get; set; } = null!;
    }
}
