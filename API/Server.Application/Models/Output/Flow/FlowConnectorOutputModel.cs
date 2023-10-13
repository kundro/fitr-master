using Server.Common.Models;

namespace Server.Application.Models.Output.Flow
{
    public class FlowConnectorOutputModel : Model
    {
        public int StartPinValueId { get; set; }
        public int EndPinValueId { get; set; }
    }
}
