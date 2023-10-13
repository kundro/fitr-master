using Server.Common.Enums;
using Server.Common.Models;

namespace Server.Application.Models.Output.Platform
{
    public class PlatformNodePinOutputModel : NamedModel
    {
        public bool IsPublic { get; set; }
        public int NodeId { get; set; }
        public PinDirection Direction { get; set; }
        public PinValueType ValueType { get; set; }
    }
}
