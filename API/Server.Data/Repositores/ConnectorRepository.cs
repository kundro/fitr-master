using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class ConnectorRepository : GenericRepository<Connector>, IConnectorRepository
    {
        public ConnectorRepository(DataContext context) : base(context)
        {
        }
    }
}
