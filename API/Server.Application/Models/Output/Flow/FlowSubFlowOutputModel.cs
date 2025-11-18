using System;

namespace Server.Application.Models.Output.Flow
{
    public class FlowSubFlowOutputModel
    {
        public int Id { get; set; }
        public int ParentFlowId { get; set; }
        public int SubFlowId { get; set; }
        public Guid GroupId { get; set; }
        public string GroupName { get; set; }
        public bool IsCollapsed { get; set; }
        public double PositionX { get; set; }
        public double PositionY { get; set; }
    }
}