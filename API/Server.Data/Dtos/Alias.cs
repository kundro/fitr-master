using Server.Common.Dtos;
using Server.Common.Enums;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class Alias : HistoricalEntity
    {
        public int FlowId { get; set; }
        public string Name { get; set; }
        public PinDirection Direction { get; set; }
        public PinValueType ValueType { get; set; }
        public ICollection<PinValueAlias> PinValueAliases { get; set; }
    }
}
