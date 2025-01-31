using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Get logger factory
var loggerFactory = LoggerFactory.Create(builder =>
{
    builder
        .AddConsole()
        .SetMinimumLevel(LogLevel.Information);
});

var logger = loggerFactory.CreateLogger<Program>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseHttpsRedirection();

// Read initial rectangle dimensions from JSON file
string jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "rectangle-config.json");
if (!File.Exists(jsonPath))
{
    File.WriteAllText(jsonPath, """{"Width": 80, "Height": 100}""");
}

app.MapGet("/api/rectangle", () =>
{
    logger.LogInformation("GET /api/rectangle called");
    var jsonContent = File.ReadAllText(jsonPath);
    logger.LogInformation("Returning rectangle data: {JsonContent}", jsonContent);
    return Results.Content(jsonContent, "application/json");
})
.WithName("GetRectangle")
.WithOpenApi();

app.MapPost("/api/rectangle/validate", async (Rectangle rectangle) =>
{
    logger.LogInformation("POST /api/rectangle/validate called with Width: {Width}, Height: {Height}", 
        rectangle.Width, rectangle.Height);
    
    await Task.Delay(10000);
    
    if (rectangle.Width > rectangle.Height)
    {
        logger.LogWarning("Validation failed: Width {Width} > Height {Height}", 
            rectangle.Width, rectangle.Height);
        return Results.BadRequest(new { error = "Width cannot be greater than height" });
    }
    
    // Save only Width and Height to JSON file
    var rectangleData = new { Width = rectangle.Width, Height = rectangle.Height };
    var jsonContent = System.Text.Json.JsonSerializer.Serialize(rectangleData);
    File.WriteAllText(jsonPath, jsonContent);
    
    logger.LogInformation("Rectangle validated and saved successfully");
    return Results.Ok(rectangleData);
})
.WithName("ValidateRectangle")
.WithOpenApi();

app.Run();

record Rectangle(double Width, double Height)
{
    public double Perimeter => 2 * (Width + Height);
}
