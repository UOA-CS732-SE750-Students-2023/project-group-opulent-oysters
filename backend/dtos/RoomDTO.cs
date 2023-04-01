using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using OpulentOysters.Models;

namespace OpulentOysters.dtos
{
    public class RoomDTO
    {
        public string Code { get; set; } = null!;
        public int CurrentOrderNumber { get; set; } = 0!;
        public bool AllowExplicit { get; set; } = false!;
        public bool RequireApproval { get; set; } = false!;

        public Room MapToRoom()
        {
            var room = new Room();
            room.Code = Code;
            room.AllowExplicit = AllowExplicit;
            room.RequireApproval = RequireApproval;
            return room;
        }
    }
}
