using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using OpulentOysters.Models;

namespace OpulentOysters.dtos
{
    public class RoomDTO
    {
        public string Code { get; set; } = null!;
        public int CurrentOrderNumber { get; set; } = 0!;
        public RoomSettings RoomSettings { get; set; } = null!;

        public Room MapToRoom()
        {
            var room = new Room();
            room.Code = Code;
            room.RoomSettings = RoomSettings;
            return room;
        }
    }
}
