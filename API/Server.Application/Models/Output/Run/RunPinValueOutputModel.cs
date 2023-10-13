using Server.Common.Enums;
using Server.Common.Models;

namespace Server.Application.Models.Output.Run
{
    public class RunPinValueOutputModel : NamedModel
    {
        public int PinId { get; set; }
        public int FlowNodeId { get; set; }
        public PinValueType ValueType { get; set; }
        public string Value { get; set; }
        public bool IsPublic { get; set; }
    }
}
