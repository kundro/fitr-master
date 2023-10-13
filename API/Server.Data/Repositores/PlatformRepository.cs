using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class PlatformRepository : GenericRepository<Platform>, IPlatformRepository
    {
        public PlatformRepository(DataContext context) : base(context)
        {
        }
    }
}
