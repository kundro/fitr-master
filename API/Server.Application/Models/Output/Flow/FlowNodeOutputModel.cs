using Server.Common.Enums;
using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Flow
{
    public class FlowNodeOutputModel : NamedModel
    {
        public int NodeId { get; set; }
        public bool IsActive { get; set; }
        public NodeCommandType CommandType { get; set; }
        public string Command { get; set; }
        public int? X { get; set; }
        public int? Y { get; set; }
        public IEnumerable<FlowPinOutputModel> InputPins { get; set; }
        public IEnumerable<FlowPinOutputModel> OutputPins { get; set; }
    }
}
