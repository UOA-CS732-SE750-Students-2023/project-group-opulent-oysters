namespace OpulentOysters.Models
{
    public class Song
    {
        public string SpotifyCode { get; set; } = null!;
        public string Name { get; set; } = null!;
        public bool IsExplicit { get; set; } = false!;
        public int Likes { get; set; } = 1!;
        public int OrderAdded { get; set; } = 0!;


    }
}
