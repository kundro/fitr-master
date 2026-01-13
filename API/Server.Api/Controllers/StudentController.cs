using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Input.Assignment;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [Authorize(Roles = "Student")]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet("assignments")]
        public async Task<IActionResult> GetMyAssignments()
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
                return Unauthorized();

            var assignments = await _studentService.GetMyAssignmentsAsync(studentId);
            return Ok(assignments);
        }

        [HttpGet("assignments/{assignmentId}/submission")]
        public async Task<IActionResult> GetMySubmission(int assignmentId)
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
                return Unauthorized();

            var submission = await _studentService.GetMySubmissionAsync(assignmentId, studentId);
            
            if (submission == null)
                return NotFound();

            return Ok(submission);
        }

        [HttpPost("assignments/submit")]
        public async Task<IActionResult> SubmitAssignment([FromBody] SubmitAssignmentInputModel model)
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
                return Unauthorized();

            var submissionId = await _studentService.SubmitAssignmentAsync(model, studentId);
            return Ok(new { id = submissionId, message = "Assignment submitted successfully" });
        }
    }
}
