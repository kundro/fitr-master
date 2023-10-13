using Server.Common.Dtos;

namespace Server.Data.Dtos
{
    public class Connector : HistoricalEntity
    {
        public int FlowId { get; set; }
        public int StartPinValueId { get; set; }
        public int EndPinValueId { get; set; }
    }
}
