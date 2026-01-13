using Server.Application.Models.Output.Auth;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IAdminService
    {
        Task<IEnumerable<PendingUserOutputModel>> GetPendingTeachersAsync();
        Task ApproveTeacherAsync(int teacherId, int adminId);
        Task RejectTeacherAsync(int teacherId);
    }
}
