using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Flow
{
    public class FlowPlatformListItemOutputModel : NamedModel
    {
        public IEnumerable<FlowNodeListItemOutputModel> Nodes { get; set; }
    }
}
