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
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.CreateHost(It.IsAny<Host>()), Times.Once());
            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.True(objectResult is OkObjectResult);
            Assert.IsType<Host>(objectResult.Value);
            Assert.Equal(200, objectResult.StatusCode);
            var resultHost = objectResult.Value as Host;
            Assert.NotNull(resultHost);
            Assert.Equal(dummyHost.Id, resultHost.Id);
            Assert.Equal(dummyHost.SpotifyToken, resultHost.SpotifyToken);
            Assert.Equal(dummyHost.Username, resultHost.Username);
        }

        [TestMethod]
        public async Task CreateRoom_ValidData()
        {
            var dummyRoomDTO = new RoomDTO { Code = "696969", CurrentOrderNumber = 0, RoomSetting = new RoomSetting { AllowExplicit = true, RequireApproval = true } };
            var dummyRoom = dummyRoomDTO.MapToRoom();
            dummyRoom.OwnerId = "dummyOwner";

            // Arrange
            var mockMongoDb = new Mock<MongoDbService>();
            mockMongoDb.Setup(x => x.CreateRoom(It.IsAny<Room>()));

            var controller = new HostController(mockMongoDb.Object);

            // Act
            var result = await controller.CreateRoom(dummyRoomDTO, "dummyOwner");
            var objectResult = result as ObjectResult;

            // Assert
            // Check database mock called once
            mockMongoDb.Verify(mock => mock.CreateRoom(It.IsAny<Room>()), Times.Once());
            // Check API response is correct
            Assert.NotNull(objectResult);
            Assert.True(objectResult is OkObjectResult);
            Assert.IsType<Room>(objectResult.Value);
            Assert.Equal(200, objectResult.StatusCode);
            var resultRoom = objectResult.Value as Room;
            Assert.NotNull(resultRoom);
            Assert.Equal(dummyRoom.Id, resultRoom.Id);
            Assert.Equal(dummyRoom.OwnerId, resultRoom.OwnerId);
            Assert.Equal(dummyRoom.Code, resultRoom.Code);
            Assert.Equal(dummyRoom.Queue, resultRoom.Queue);
            Assert.Equal(dummyRoom.RoomSetting, resultRoom.RoomSetting);
        }
    }
}