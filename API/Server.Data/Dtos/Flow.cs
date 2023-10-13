using Server.Common.Dtos;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class Flow : HistoricalEntity
    {
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public ICollection<Alias> Aliases { get; set; }
        public ICollection<FlowNode> FlowNodes { get; set; }
        public ICollection<Connector> Connectors { get; set; }
    }
}
