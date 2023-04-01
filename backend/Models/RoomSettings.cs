using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace OpulentOysters.Models
{
    public class RoomSettings
    {
        public bool AllowExplicit { get; set; } = false!;
        public bool RequireApproval { get; set; } = false!;
    }
}
