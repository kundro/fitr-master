using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Input.Flow
{
    public class FlowNodeInputModel : NamedModel
    {
        public int NodeId { get; set; }
        public int? SubFlowId { get; set; }
        public IEnumerable<FlowNodePinValueInputModel> PinValues { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}
