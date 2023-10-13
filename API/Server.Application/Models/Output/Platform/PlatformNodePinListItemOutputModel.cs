using Server.Common.Enums;
using Server.Common.Models;

namespace Server.Application.Models.Output.Platform
{
    public class PlatformNodePinListItemOutputModel : NamedModel
    {
        public PinDirection Direction { get; set; }
    }
}
