using Microsoft.AspNetCore.Mvc.Testing;

namespace OpulentOysters.Test
{
    [TestClass]
    public class HostTests
    {
        private HttpClient _httpClient;
        public HostTests()
        {
            //Starts the server
            var webAppFactory = new WebApplicationFactory<Program>();
            _httpClient = webAppFactory.CreateDefaultClient();
        }
        [TestMethod]
        public async Task CreateHost()
        {
            var response = await _httpClient.GetAsync("/api/Host/GetQueue?roomCode=123456");
            var result = await response.Content.ReadAsStringAsync();

            Assert.AreEqual("Hello World", result);
        }
    }
}