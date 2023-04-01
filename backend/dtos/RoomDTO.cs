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
        public RoomSetting RoomSetting { get; set; } = null!;

        public Room MapToRoom()
        {
            var room = new Room();
            room.Code = Code;
            room.RoomSetting = RoomSetting;
            return room;
        }
    }
}


