using OpulentOysters.Models;
using Host = OpulentOysters.Models.Host;

namespace OpulentOysters.dtos
{
    public class RoomDTO
    {
        public string OwnerId { get; set; } = null!;
        public string OwnerName { get; set; } = null!;
        public string Code { get; set; } = null!;
        public RoomSetting RoomSetting { get; set; } = null!;
        public List<User> Users { get; set; } = new List<User>();
    }
}