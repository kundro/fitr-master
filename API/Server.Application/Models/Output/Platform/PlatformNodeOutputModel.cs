using Server.Common.Models;
using Server.Common.Enums;

namespace Server.Application.Models.Output.Platform
{
    public class PlatformNodeOutputModel : NamedModel
    {
        public int PlatformId { get; set; }
        public NodeCommandType CommandType { get; set; }
        public string Command { get; set; }
        public bool IsActive { get; set; }
    }
}
