using OpulentOysters.Models;
using Host = OpulentOysters.Models.Host;

namespace OpulentOysters.dtos
{
    public class HostDTO
    {
        public string SpotifyToken { get; set; } = null!;
        public Host MapToUser()
        {
            var host = new Host();
            host.Username = "Username";
            host.SpotifyToken = SpotifyToken;
            return host;
        }
    }
}
