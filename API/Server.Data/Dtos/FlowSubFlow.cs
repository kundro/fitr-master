using Server.Common.Dtos;
using System;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class FlowSubFlow : HistoricalEntity
    {
        public int ParentFlowId { get; set; }
        public int SubFlowId { get; set; }
        public Guid GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsCollapsed { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }

        // Navigation properties
        public Flow ParentFlow { get; set; }
        public Flow SubFlow { get; set; }
        public ICollection<FlowNode> FlowNodes { get; set; }
    }
}