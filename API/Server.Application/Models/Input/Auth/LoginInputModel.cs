using System.ComponentModel.DataAnnotations;

namespace Server.Application.Models.Input.Auth
{
    public class LoginInputModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
    }
}
