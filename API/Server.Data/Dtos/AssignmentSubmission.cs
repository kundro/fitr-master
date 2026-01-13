using Server.Common.Dtos;
using System;

namespace Server.Data.Dtos
{
    public class AssignmentSubmission : HistoricalEntity
    {
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public string FlowData { get; set; }
        public int? Score { get; set; }
        public string Status { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public DateTime? GradedDate { get; set; }
        public string TeacherFeedback { get; set; }

        public Assignment Assignment { get; set; }
        public ApplicationUser Student { get; set; }
    }
}
