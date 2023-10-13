using Server.Common.Enums;
using Server.Common.Models;

namespace Server.Application.Models.Output.Flow
{
    public class FlowPinOutputModel : NamedModel
    {
        public int PinId { get; set; }
        public int NodeId { get; set; }
        public int FlowNodeId { get; set; }
        public bool IsPublic { get; set; }
        public string Value { get; set; }
        public PinValueType ValueType { get; set; }
        public PinDirection Direction { get; set; }
    }
}
