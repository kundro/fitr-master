using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class AssignmentRepository : GenericRepository<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(DataContext context) : base(context)
        {
        }
    }
}
