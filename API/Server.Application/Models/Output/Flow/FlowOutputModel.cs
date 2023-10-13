using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Flow
{
    public class FlowOutputModel : NamedModel
    {
        public bool IsActive { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public IEnumerable<FlowAliasOutputModel> Aliases { get; set; }
        public IEnumerable<FlowNodeOutputModel> Nodes { get; set; }
        public IEnumerable<FlowConnectorOutputModel> Connectors { get; set; }
    }
}
