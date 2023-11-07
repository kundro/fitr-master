using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Output.Flow;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<bool> Login([FromBody] UserLoginInputModel model)
        {
            var res = await _userService.Login(model);

            return res;
        }

        [HttpPost("signup")]
        public async Task<bool> SignUp()
        {
            var res = await _userService.SignUp();

            return res;
        }

        [HttpPost("reset")]
        public async Task<bool> Reset()
        {
            var res = await _userService.ResetPassword();

            return res;
        }
    }
}
