using Autofac.Extras.Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Options;
using Moq;
using OpulentOysters.Controllers;
using OpulentOysters.dtos;
using OpulentOysters.Models;
using OpulentOysters.Services;
using SpotifyAPI.Web;
using System.Text.Json;
using Xunit;
using Assert = Xunit.Assert;

namespace OpulentOysters.Test
{
    [TestClass]
    public class UserTests
    {
        [TestMethod]
        public async Task CreateUser_ValidData()
        {
            var dummyUserDto = new UserDto { Username = "dummy123" };

            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.CreateUser(It.IsAny<User>()));

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.CreateUser(dummyUserDto);
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.CreateUser(It.IsAny<User>()), Times.Once());
            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.True(objectResult is OkObjectResult);
            Assert.IsType<User>(objectResult.Value);
            Assert.Equal(200, objectResult.StatusCode);
            var resultUser = objectResult.Value as User;
            Assert.NotNull(resultUser);
            Assert.Equal(dummyUserDto.Username, resultUser.Username);
        }

        [TestMethod]
        public async Task SearchSong_ValidData()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.GetTokenFromRoomId(696969))
                .Returns(GetDummyToken);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.SearchSong("Hello", 696969);
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.GetTokenFromRoomId(696969), Times.Once());
            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.True(objectResult is OkObjectResult);
            Assert.IsType<List<Song>>(objectResult.Value);
            Assert.Equal(200, objectResult.StatusCode);
            var resultSongs = objectResult.Value as List<Song>;
            Assert.NotNull(resultSongs);
        }

        private async Task<string> GetDummyToken()
        {
            var config = SpotifyClientConfig.CreateDefault();

            var request = new ClientCredentialsRequest("cddea26bbe4a468bae595c6581073ec2", "82894404ac4c4b98a9531340eb46c1b6");
            var response = await new OAuthClient(config).RequestToken(request);

            return response.AccessToken;
        }

    }
}