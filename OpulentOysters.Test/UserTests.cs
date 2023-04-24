using Autofac.Extras.Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Options;
using Moq;
using OpulentOysters.Controllers;
using OpulentOysters.dtos;
using OpulentOysters.Enums;
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

        [TestMethod]
        public async Task AddSong_ValidData()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.GetTokenFromRoomId(696969))
                .Returns(GetDummyToken);
            mockMongoDb.Setup(x => x.AddSongToRoom(696969, It.IsAny<Song>()));
            mockMongoDb.Setup(x => x.GetAndUpdateCurrentOrderNumber(696969))
                .ReturnsAsync(GetDummyOrderNumber);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.AddSong("3r8RuvgbX9s7ammBn07D3W", 696969);
            var noContentResult = result as NoContentResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.GetTokenFromRoomId(696969), Times.Once());
            mockMongoDb.Verify(mock => mock.AddSongToRoom(696969, It.IsAny<Song>()), Times.Once());
            mockMongoDb.Verify(mock => mock.GetAndUpdateCurrentOrderNumber(696969), Times.Once());

            // Check API response is correct
            Assert.NotNull(noContentResult);
            Assert.Equal(204, noContentResult.StatusCode);
        }

        private int GetDummyOrderNumber()
        {
            return 2;
        }

        [TestMethod]
        public async Task UpvoteSong_ValidData()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.UpvoteSong(696969, "dummyTrackId", "dummyUser123"))
                .ReturnsAsync(GetSuccessfulSongVoteResponse);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.UpvoteSong("dummyTrackId", 696969, "dummyUser123");
            var noContentResult = result as NoContentResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.UpvoteSong(696969, "dummyTrackId", "dummyUser123"), Times.Once());

            // Check API response is correct
            Assert.NotNull(noContentResult);
            Assert.Equal(204, noContentResult.StatusCode);
        }

        private SongVoteResponse GetSuccessfulSongVoteResponse()
        {
            return SongVoteResponse.Success;
        }

        [TestMethod]
        public async Task UpvoteSong_NotFoundSong()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.UpvoteSong(696969, "notFoundId", "dummyUser123"))
                .ReturnsAsync(GetNotFoundSongVoteResponse);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.UpvoteSong("notFoundId", 696969, "dummyUser123");
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.UpvoteSong(696969, "notFoundId", "dummyUser123"), Times.Once());

            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.Equal(404, objectResult.StatusCode);
            Assert.Equal("Song not found", objectResult.Value);
        }

        private SongVoteResponse GetNotFoundSongVoteResponse()
        {
            return SongVoteResponse.SongNotFound;
        }

        [TestMethod]
        public async Task UpvoteSong_AlreadyLikedSong()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.UpvoteSong(696969, "alreadyLikedId", "dummyUser123"))
                .ReturnsAsync(GetAlreadyLikedSongVoteResponse);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.UpvoteSong("alreadyLikedId", 696969, "dummyUser123");
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.UpvoteSong(696969, "alreadyLikedId", "dummyUser123"), Times.Once());

            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.Equal(409, objectResult.StatusCode);
            Assert.Equal("Song already liked", objectResult.Value);
        }

        private SongVoteResponse GetAlreadyLikedSongVoteResponse()
        {
            return SongVoteResponse.AlreadyLiked;
        }

        [TestMethod]
        public async Task DownvoteSong_ValidData()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.DownvoteSong(696969, "dummyTrackId", "dummyUser123"))
                .ReturnsAsync(GetSuccessfulSongVoteResponse);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.DownvoteSong("dummyTrackId", 696969, "dummyUser123");
            var noContentResult = result as NoContentResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.DownvoteSong(696969, "dummyTrackId", "dummyUser123"), Times.Once());

            // Check API response is correct
            Assert.NotNull(noContentResult);
            Assert.Equal(204, noContentResult.StatusCode);
        }

        [TestMethod]
        public async Task DownvoteSong_NotFoundSong()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.DownvoteSong(696969, "notFoundId", "dummyUser123"))
                .ReturnsAsync(GetNotFoundSongVoteResponse);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.DownvoteSong("notFoundId", 696969, "dummyUser123");
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.DownvoteSong(696969, "notFoundId", "dummyUser123"), Times.Once());

            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.Equal(404, objectResult.StatusCode);
            Assert.Equal("Song not found", objectResult.Value);
        }

        [TestMethod]
        public async Task DownvoteSong_AlreadyDislikedSong()
        {
            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.DownvoteSong(696969, "alreadyLikedId", "dummyUser123"))
                .ReturnsAsync(GetAlreadyDislikedSongVoteResponse);

            var controller = new UserController(mockMongoDb.Object);

            // Act
            var result = await controller.DownvoteSong("alreadyLikedId", 696969, "dummyUser123");
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.DownvoteSong(696969, "alreadyLikedId", "dummyUser123"), Times.Once());

            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.Equal(409, objectResult.StatusCode);
            Assert.Equal("Song already disliked", objectResult.Value);
        }

        private SongVoteResponse GetAlreadyDislikedSongVoteResponse()
        {
            return SongVoteResponse.AlreadyDisliked;
        }
    }
}