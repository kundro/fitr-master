using Server.Common.Dtos;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class Platform : HistoricalEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public bool IsActive { get; set; }

        public ICollection<Node> Nodes { get; set; }
    }
}
