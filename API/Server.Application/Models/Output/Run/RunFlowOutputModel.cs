using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Run
{
    public class RunFlowOutputModel : NamedModel
    {
        public IEnumerable<RunAliasOutputModel> Aliases { get; set; }
        public IEnumerable<RunNodeOutputModel> Nodes { get; set; }
        public IEnumerable<RunConnectorOutputModel> Connectors { get; set; }
    }
}
