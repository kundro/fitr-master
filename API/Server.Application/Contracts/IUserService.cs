using Server.Application.Models.Output.Flow;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IUserService
    {
        Task<bool> Login(UserLoginInputModel model);
        Task<bool> SignUp();
        Task<bool> ResetPassword();
    }
}
