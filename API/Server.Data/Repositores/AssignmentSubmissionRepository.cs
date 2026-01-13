using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class AssignmentSubmissionRepository : GenericRepository<AssignmentSubmission>, IAssignmentSubmissionRepository
    {
        public AssignmentSubmissionRepository(DataContext context) : base(context)
        {
        }
    }
}
