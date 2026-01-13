using System.ComponentModel.DataAnnotations;

namespace Server.Application.Models.Input.Assignment
{
    public class SubmitAssignmentInputModel
    {
        [Required]
        public int AssignmentId { get; set; }
        
        public string FlowData { get; set; }
    }
}
