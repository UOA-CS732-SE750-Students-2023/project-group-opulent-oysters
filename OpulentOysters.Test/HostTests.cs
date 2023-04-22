using Autofac.Extras.Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Options;
using Moq;
using OpulentOysters.Controllers;
using OpulentOysters.dtos;
using OpulentOysters.Models;
using OpulentOysters.Services;
using System.Text.Json;

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
        public async Task CreateHost_ValidData()
        {
            var dummyHostDTO = new HostDTO { SpotifyToken = "test", Username = "dummy123" };
            var dummyHost = dummyHostDTO.MapToUser();
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.CreateHost(dummyHost));

            var controller = new HostController(mockMongoDb.Object);

            // Act
            var result = await controller.CreateHost(dummyHostDTO);
            var okResult = result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }
    }
}