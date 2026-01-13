using Server.Application.Models.Input.Assignment;
using Server.Application.Models.Output.Assignment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface ITeacherService
    {
        Task<IEnumerable<PendingUserOutputModel>> GetPendingStudentsAsync(int teacherId);
        Task ApproveStudentAsync(int studentId, int teacherId);
        Task RejectStudentAsync(int studentId);
        Task<int> CreateAssignmentAsync(CreateAssignmentInputModel model, int teacherId);
        Task<IEnumerable<AssignmentOutputModel>> GetMyAssignmentsAsync(int teacherId);
        Task<IEnumerable<SubmissionOutputModel>> GetAssignmentSubmissionsAsync(int assignmentId);
        Task GradeSubmissionAsync(int submissionId, GradeSubmissionInputModel model);
    }
}
