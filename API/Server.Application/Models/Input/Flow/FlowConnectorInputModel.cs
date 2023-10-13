using Server.Common.Models;

namespace Server.Application.Models.Input.Flow
{
    public class FlowConnectorInputModel
    {
        public int Id { get; set; }
        public string StartPinValueKey { get; set; }
        public string EndPinValueKey { get; set; }
    }
}
