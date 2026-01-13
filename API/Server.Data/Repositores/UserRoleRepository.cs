using Server.Data.Contexts;
using Server.Data.Contracts;
using Server.Data.Dtos;

namespace Server.Data.Repositores
{
    public class UserRoleRepository : GenericRepository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(DataContext context) : base(context)
        {
        }
    }
}
