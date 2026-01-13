using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Input.Assignment;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [Authorize(Roles = "Teacher")]
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;

        public TeacherController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [HttpGet("pending-students")]
        public async Task<IActionResult> GetPendingStudents()
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized();

            var students = await _teacherService.GetPendingStudentsAsync(teacherId);
            return Ok(students);
        }

        [HttpPost("approve-student/{studentId}")]
        public async Task<IActionResult> ApproveStudent(int studentId)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized();

            await _teacherService.ApproveStudentAsync(studentId, teacherId);
            return Ok(new { message = "Student approved successfully" });
        }

        [HttpPost("reject-student/{studentId}")]
        public async Task<IActionResult> RejectStudent(int studentId)
        {
            await _teacherService.RejectStudentAsync(studentId);
            return Ok(new { message = "Student rejected and removed" });
        }

        [HttpPost("assignments")]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentInputModel model)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized();

            var assignmentId = await _teacherService.CreateAssignmentAsync(model, teacherId);
            return Ok(new { id = assignmentId, message = "Assignment created successfully" });
        }

        [HttpGet("assignments")]
        public async Task<IActionResult> GetMyAssignments()
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized();

            var assignments = await _teacherService.GetMyAssignmentsAsync(teacherId);
            return Ok(assignments);
        }

        [HttpGet("assignments/{assignmentId}/submissions")]
        public async Task<IActionResult> GetAssignmentSubmissions(int assignmentId)
        {
            var submissions = await _teacherService.GetAssignmentSubmissionsAsync(assignmentId);
            return Ok(submissions);
        }

        [HttpPost("submissions/{submissionId}/grade")]
        public async Task<IActionResult> GradeSubmission(int submissionId, [FromBody] GradeSubmissionInputModel model)
        {
            await _teacherService.GradeSubmissionAsync(submissionId, model);
            return Ok(new { message = "Submission graded successfully" });
        }
    }
}
