using Server.Common.Enums;
using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Run
{
    public class RunNodeOutputModel: NamedModel
    {
        public int NodeId { get; set; }
        public NodeCommandType CommandType { get; set; }
        public string Command { get; set; }
        public int? SubFlowId { get; set; }
        public IEnumerable<RunPinValueOutputModel> InputPins { get; set; }
        public IEnumerable<RunPinValueOutputModel> OutputPins { get; set; }
    }
}
