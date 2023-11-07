using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Common.Dtos;
using Server.Data.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok("User registered successfully.");
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = GenerateJwtToken(user);
                return Ok(new { token });
            }

            return Unauthorized("Invalid email or password.");
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetUserProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = _userManager.FindByIdAsync(userId).Result;

            // Вернуть профиль пользователя
            return Ok(user);
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
                // Добавьте другие желаемые claims
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKeyHere"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "Issuer",
                audience: "Audience",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Указываете срок действия токена
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
