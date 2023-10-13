using Server.Common.Dtos;

namespace Server.Data.Dtos
{
    public class PinValue : HistoricalEntity
    {
        public string Key { get; set; }
        public int PinId { get; set; }
        public int FlowNodeId { get; set; }
        public string Value { get; set; }

        public Pin Pin { get; set; }
        public PinValueAlias Alias { get; set; }
    }
}
