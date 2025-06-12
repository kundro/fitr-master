using Server.Common.Dtos;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class FlowNode : HistoricalEntity
    {
        public string Name { get; set; }
        public int FlowId { get; set; }
        public int NodeId { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public int? SubFlowId { get; set; }
        public Flow SubFlow { get; set; }

        public Node Node { get; set; }
        public ICollection<PinValue> PinValues { get; set; }
    }
}
