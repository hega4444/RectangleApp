using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using System.Text.Json;

namespace Backend.Tests;

public class RectangleEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    public RectangleEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_ReturnsSuccessAndRectangle()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/rectangle");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Post_WithValidDimensions_ReturnsSuccess()
    {
        // Arrange
        var client = _factory.CreateClient();
        var rectangle = new { Width = 50, Height = 100 };
        var content = new StringContent(
            JsonSerializer.Serialize(rectangle),
            Encoding.UTF8,
            "application/json");

        // Act
        var response = await client.PostAsync("/api/rectangle", content);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Post_WithInvalidDimensions_ReturnsBadRequest()
    {
        // Arrange
        var client = _factory.CreateClient();
        var rectangle = new { Width = 100, Height = 50 }; // Width > Height
        var content = new StringContent(
            JsonSerializer.Serialize(rectangle),
            Encoding.UTF8,
            "application/json");

        // Act
        var response = await client.PostAsync("/api/rectangle", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}