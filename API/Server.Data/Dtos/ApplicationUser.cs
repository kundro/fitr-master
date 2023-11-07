using Microsoft.AspNetCore.Identity;
using Server.Common.Dtos;

namespace Server.Data.Dtos
{
    public class ApplicationUser : HistoricalEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserType { get; set; }
    }
}
