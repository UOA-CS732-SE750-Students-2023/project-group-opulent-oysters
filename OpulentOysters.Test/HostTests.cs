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
using Xunit;
using Assert = Xunit.Assert;

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
            mockMongoDb.Setup(x => x.CreateHost(It.IsAny<Host>()));

            var controller = new HostController(mockMongoDb.Object);

            // Act
            var result = await controller.CreateHost(dummyHostDTO);
            var okResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.CreateHost(It.IsAny<Host>()), Times.Once());
            // Check API response is correct
            Assert.NotNull(okResult);
            Assert.True(okResult is OkObjectResult);
            Assert.IsType<Host>(okResult.Value);
            Assert.Equal(200, okResult.StatusCode);
            var resultHost = okResult.Value as Host;
            Assert.NotNull(resultHost);
            Assert.Equal(dummyHost.Id, resultHost.Id);
            Assert.Equal(dummyHost.SpotifyToken, resultHost.SpotifyToken);
            Assert.Equal(dummyHost.Username, resultHost.Username);
        }
    }
}