using Server.Common.Dtos;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class UserRole : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<ApplicationUser> Users { get; set; }
    }
}
