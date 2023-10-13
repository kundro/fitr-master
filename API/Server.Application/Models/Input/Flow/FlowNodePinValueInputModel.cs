using Server.Common.Models;

namespace Server.Application.Models.Input.Flow
{
    public class FlowNodePinValueInputModel : Model
    {
        public string Key { get; set; }
        public int PinId { get; set; }
        public string Value { get; set; }
    }
}
