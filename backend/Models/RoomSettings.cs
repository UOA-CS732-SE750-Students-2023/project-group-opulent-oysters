using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace OpulentOysters.Models
{
    public class RoomSettings
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public int RoomId { get; set; } = 0!;
        public bool AllowExplicit { get; set; } = false!;
        public bool RequireApproval { get; set; } = false!;
    }
}
