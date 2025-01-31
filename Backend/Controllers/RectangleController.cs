using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RectangleController : ControllerBase
    {
        private static RectangleDimensions _dimensions = new RectangleDimensions { Width = 100, Height = 100 };

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_dimensions);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RectangleDimensions dimensions)
        {
            // Simulate long-running validation
            await Task.Delay(10000);

            if (dimensions.Width > dimensions.Height)
            {
                return BadRequest(new { message = "Width cannot exceed height." });
            }

            _dimensions = dimensions;
            return Ok(_dimensions);
        }
    }
} 