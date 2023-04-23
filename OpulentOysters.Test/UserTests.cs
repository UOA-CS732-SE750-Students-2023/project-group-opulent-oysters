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

    }
}