using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class AliasRepository : GenericRepository<Alias>, IAliasRepository
    {
        public AliasRepository(DataContext context) : base(context)
        {
        }
    }
}
