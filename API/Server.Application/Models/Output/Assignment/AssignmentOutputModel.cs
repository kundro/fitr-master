using System;

namespace Server.Application.Models.Output.Assignment
{
    public class AssignmentOutputModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public int MaxScore { get; set; }
        public bool IsActive { get; set; }
        public string TeacherName { get; set; }
        public string FlowName { get; set; }
        public int FlowId { get; set; }
    }
}
