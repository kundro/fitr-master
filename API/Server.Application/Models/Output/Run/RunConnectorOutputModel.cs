using Server.Common.Models;

namespace Server.Application.Models.Output.Run
{
    public class RunConnectorOutputModel : Model
    {
        public int StartPinValueId { get; set; }
        public int EndPinValueId { get; set; }
    }
}
