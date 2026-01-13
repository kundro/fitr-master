using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Application.Models.Input.Assignment
{
    public class CreateAssignmentInputModel
    {
        [Required]
        public int FlowId { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public int MaxScore { get; set; } = 100;
    }
}
