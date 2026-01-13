using Server.Application.Models.Input.Auth;
using Server.Application.Models.Output.Auth;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IAuthService
    {
        Task<LoginOutputModel> LoginAsync(LoginInputModel model);
        Task<RegisterOutputModel> RegisterAsync(RegisterInputModel model);
        Task<UserOutputModel> GetCurrentUserAsync(int userId);
        Task<RegisterOutputModel> InitializeAdminAsync(string password);
    }
}
