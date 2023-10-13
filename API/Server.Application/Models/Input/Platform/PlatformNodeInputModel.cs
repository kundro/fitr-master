using Server.Common.Enums;
using Server.Common.Models;

namespace Server.Application.Models.Input.Platform
{
    public class PlatformNodeInputModel : NamedModel
    {
        public int PlatformId { get; set; }
        public NodeCommandType CommandType { get; set; }
        public string Command { get; set; }
        public bool IsActive { get; set; }
    }
}
