namespace Server.Application.Models.Output.Auth
{
    public class LoginOutputModel
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
        public UserOutputModel User { get; set; }
    }
}
