using Server.Common.Dtos;
using Server.Common.Enums;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class Node : HistoricalEntity
    {
        public int PlatformId { get; set; }
        public string Name { get; set; }
        public NodeCommandType CommandType { get; set; }
        public string Command { get; set; }
        public bool IsActive { get; set; }

        public ICollection<Pin> Pins { get; set; }
    }
}
