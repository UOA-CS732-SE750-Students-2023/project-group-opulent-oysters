namespace OpulentOysters.Models
{
    public class Song
    {
        public string SpotifyCode { get; set; } = null!;
        public string Name { get; set; } = null!;
        public bool IsExplicit { get; set; } = false!;
        public int Likes { get; set; } = 1!;
        public List<string> LikedByUserId { get; set; } = new List<string>();
        public int OrderAdded { get; set; } = 0!;
        public string ImageUrl { get; set; } = null!;
        public List<string> Artists { get; set; } = new List<string>();
        public int SongLengthMS { get; set; } = 0!;

        public Song() {}
        
        public Song(string spotifyCode, string name, bool isExplicit, string imageUrl, List<string> artists, int songLengthMs)
        {
            SpotifyCode = spotifyCode;
            Name = name;
            IsExplicit = isExplicit;
            ImageUrl = imageUrl;
            Artists = artists;
            SongLengthMS = songLengthMs;
        }
    }
}
