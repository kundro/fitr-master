using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Flow
{
    public class FlowsAsTasksListItemOutputModel : NamedModel
    {
        public IEnumerable<FlowListItemOutputModel> Flows { get; set; }
    }
}
