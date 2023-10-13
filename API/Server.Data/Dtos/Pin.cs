using Server.Common.Dtos;
using Server.Common.Enums;

namespace Server.Data.Dtos
{
    public class Pin : HistoricalEntity
    {
        public int NodeId { get; set; }
        public string Name { get; set; }
        public bool IsPublic { get; set; }
        public PinDirection Direction { get; set; }
        public PinValueType ValueType { get; set; }
    }
}
