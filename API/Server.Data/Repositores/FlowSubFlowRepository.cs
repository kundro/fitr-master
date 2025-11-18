using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class FlowSubFlowRepository : GenericRepository<FlowSubFlow>, IFlowSubFlowRepository
    {
        public FlowSubFlowRepository(DataContext context) : base(context)
        {
        }
    }
}