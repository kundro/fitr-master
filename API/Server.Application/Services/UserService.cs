using Server.Application.Contracts;
using Server.Application.Models.Output.Flow;
using Server.Data.Contracts;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConnectorRepository _connectorRepository;
        private readonly IAliasRepository _aliasRepository;


        public UserService(
            IUserRepository userRepository,
            IConnectorRepository connectorRepository,
            IAliasRepository aliasRepository)
        {
            _userRepository = userRepository;
            _connectorRepository = connectorRepository;
            _aliasRepository = aliasRepository;
        }

        public async Task<bool> Login(UserLoginInputModel model)
        {
            if (model != null)
            {
                try
                {
                    await _userRepository.BeginTransactionAsync();
                    //await _userRepository.AddAsync(model);

                    await _userRepository.CommitTransactionAsync();

                    return true;
                }
                catch
                {
                    await _userRepository.RollbackTransactionAsync();
                    throw;
                }
            }

            return false;
        }

        public async Task<bool> SignUp()
        {
            try
            {
                await _userRepository.BeginTransactionAsync();
                //await _userRepository.AddAsync(model);

                await _userRepository.CommitTransactionAsync();

                return true;
            }
            catch
            {
                await _userRepository.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<bool> ResetPassword()
        {
            try
            {
                await _userRepository.BeginTransactionAsync();
                //await _userRepository.AddAsync(model);

                await _userRepository.CommitTransactionAsync();

                return true;
            }
            catch
            {
                await _userRepository.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
