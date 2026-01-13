using System.ComponentModel.DataAnnotations;

namespace Server.Application.Models.Input.Assignment
{
    public class GradeSubmissionInputModel
    {
        [Required]
        [Range(0, int.MaxValue)]
        public int Score { get; set; }
        
        public string TeacherFeedback { get; set; }
    }
}
