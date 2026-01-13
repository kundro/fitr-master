using System.ComponentModel.DataAnnotations;

namespace Server.Application.Models.Input.Auth
{
    public class RegisterInputModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [MinLength(6)]
        public string Password { get; set; }
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        public string Role { get; set; } // "Teacher" or "Student"
    }
}
