namespace OpulentOysters.dtos
{
    public class TransferPlaybackDTO
    {
        public List<string> DeviceIds { get; set; } = new List<string>();
        public string RoomCode { get; set; } = null!;
    }
}
