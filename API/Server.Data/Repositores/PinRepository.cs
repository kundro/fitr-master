using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class PinRepository : GenericRepository<Pin>, IPinRepository
    {
        public PinRepository(DataContext context) : base(context)
        {
        }
    }
}
