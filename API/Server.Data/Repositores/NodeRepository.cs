using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class NodeRepository : GenericRepository<Node>, INodeRepository
    {
        public NodeRepository(DataContext context) : base(context)
        {
        }
    }
}
