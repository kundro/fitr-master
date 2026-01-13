using System;

namespace Server.Application.Models.Output.Assignment
{
    public class SubmissionOutputModel
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public string StudentName { get; set; }
        public string Status { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public DateTime? GradedDate { get; set; }
        public int? Score { get; set; }
        public string TeacherFeedback { get; set; }
        public string FlowData { get; set; }
    }
}
