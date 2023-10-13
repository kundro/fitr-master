using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class FlowRepository : GenericRepository<Flow>, IFlowRepository
    {
        public FlowRepository(DataContext context) : base(context)
        {
        }
    }
}
