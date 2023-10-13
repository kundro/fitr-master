using Server.Common.Dtos;

namespace Server.Data.Dtos
{
    public class PinValueAlias : HistoricalEntity
    {
        public int AliasId { get; set; }
        public int PinValueId { get; set; }
    }
}
