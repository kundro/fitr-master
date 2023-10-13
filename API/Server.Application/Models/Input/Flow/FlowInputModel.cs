using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Input.Flow
{
    public class FlowInputModel : NamedModel
    {
        public bool IsActive { get; set; }
        public IEnumerable<FlowAliasInputModel> Aliases { get; set; }
        public IEnumerable<FlowNodeInputModel> FlowNodes { get; set; }
        public IEnumerable<FlowConnectorInputModel> Connectors { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}
