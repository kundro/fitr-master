using Server.Application.Models.Input.Assignment;
using Server.Application.Models.Output.Assignment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IStudentService
    {
        Task<IEnumerable<AssignmentOutputModel>> GetMyAssignmentsAsync(int studentId);
        Task<SubmissionOutputModel> GetMySubmissionAsync(int assignmentId, int studentId);
        Task<int> SubmitAssignmentAsync(SubmitAssignmentInputModel model, int studentId);
    }
}
