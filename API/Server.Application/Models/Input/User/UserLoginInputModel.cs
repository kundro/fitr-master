using Server.Common.Enums;
using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Flow
{
    public class UserLoginInputModel : NamedModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
