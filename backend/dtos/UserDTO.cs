using OpulentOysters.Models;

namespace OpulentOysters.dtos
{
    public class UserDto
    {
        public string Username { get; set; } = null!;
        public User MapToUser()
        {
            var user = new User();
            user.Username = Username;
            return user;
        }
    }
}
