using Server.Common.Dtos;
using System;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class Assignment : HistoricalEntity
    {
        public int TeacherId { get; set; }
        public int FlowId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? DueDate { get; set; }
        public int MaxScore { get; set; }
        public bool IsActive { get; set; }

        public ApplicationUser Teacher { get; set; }
        public Flow Flow { get; set; }
        public ICollection<AssignmentSubmission> Submissions { get; set; }
    }
}
