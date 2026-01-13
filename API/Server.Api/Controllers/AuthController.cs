using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Input.Auth;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInputModel model)
        {
            var result = await _authService.LoginAsync(model);
            
            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInputModel model)
        {
            var result = await _authService.RegisterAsync(model);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var user = await _authService.GetCurrentUserAsync(userId);
            
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost("init-admin")]
        public async Task<IActionResult> InitializeAdmin([FromBody] InitAdminInputModel model)
        {
            var result = await _authService.InitializeAdminAsync(model.Password);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}

public class InitAdminInputModel
{
    public string Password { get; set; }
}
