using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("pending-teachers")]
        public async Task<IActionResult> GetPendingTeachers()
        {
            var teachers = await _adminService.GetPendingTeachersAsync();
            return Ok(teachers);
        }

        [HttpPost("approve-teacher/{teacherId}")]
        public async Task<IActionResult> ApproveTeacher(int teacherId)
        {
            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminIdClaim) || !int.TryParse(adminIdClaim, out int adminId))
                return Unauthorized();

            await _adminService.ApproveTeacherAsync(teacherId, adminId);
            return Ok(new { message = "Teacher approved successfully" });
        }

        [HttpPost("reject-teacher/{teacherId}")]
        public async Task<IActionResult> RejectTeacher(int teacherId)
        {
            await _adminService.RejectTeacherAsync(teacherId);
            return Ok(new { message = "Teacher rejected and removed" });
        }
    }
}
