using Microsoft.Extensions.Logging;
using System.Text.Json;

// Rectangle App - Backend
// A minimal API service that manages rectangle dimensions with validation
// Author: hega4444
// Date: January 31, 2025

var builder = WebApplication.CreateBuilder(args);

// Configure logging to show only relevant application events
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Warning);
builder.Logging.AddFilter("Backend", LogLevel.Information);

// Configure CORS to allow React frontend communication
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowReactApp");

// Initialize JSON storage
string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "rectangle-config.json");
if (!File.Exists(jsonPath))
{
    File.WriteAllText(jsonPath, """{"Width": 80, "Height": 100}""");
}

// Configure JSON serialization for consistent property casing
var jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

// GET: Retrieve current rectangle dimensions
app.MapGet("/api/rectangle", () =>
{
    var rectangle = new Rectangle(80, 100);
    if (File.Exists(jsonPath))
    {
        var content = File.ReadAllText(jsonPath);
        rectangle = JsonSerializer.Deserialize<Rectangle>(content, jsonOptions) ?? rectangle;
    }
    
    app.Logger.LogInformation("📐 Rectangle loaded: {Width}x{Height}", rectangle.Width, rectangle.Height);
    return Results.Content(JsonSerializer.Serialize(rectangle, jsonOptions), "application/json");
});

// POST: Update rectangle dimensions with validation
app.MapPost("/api/rectangle", async (Rectangle rectangle) =>
{
    app.Logger.LogInformation("✏️ Rectangle resize started: {Width}x{Height}", rectangle.Width, rectangle.Height);
    
    // Simulate complex validation process
    app.Logger.LogInformation("⏳ Validating dimensions...");
    await Task.Delay(10000);

    // Business rule: Width must not exceed height
    if (rectangle.Width > rectangle.Height)
    {
        app.Logger.LogWarning("❌ Validation failed: Width > Height");
        return Results.BadRequest(new { 
            error = "Rectangle width cannot be greater than height. Please adjust the dimensions." 
        });
    }

    var jsonContent = JsonSerializer.Serialize(rectangle, jsonOptions);
    File.WriteAllText(jsonPath, jsonContent);
    app.Logger.LogInformation("✅ Rectangle saved: {Width}x{Height}", rectangle.Width, rectangle.Height);
    return Results.Ok(rectangle);
});

app.Run();

// Data model for rectangle dimensions
record Rectangle(double Width, double Height);
