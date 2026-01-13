using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Server.Application.Contracts;
using Server.Application.Models.Input.Auth;
using Server.Application.Models.Output.Auth;
using Server.Data.Contracts;
using Server.Data.Dtos;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserRoleRepository _roleRepository;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            IUserRoleRepository roleRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _configuration = configuration;
        }

        public async Task<LoginOutputModel> LoginAsync(LoginInputModel model)
        {
            var user = (await _userRepository.GetAllAsync(
                null,
                include => include.Include(u => u.Role),
                predicate: u => u.Email == model.Email
            )).Items.FirstOrDefault();

            if (user == null)
            {
                return new LoginOutputModel
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            if (!VerifyPassword(model.Password, user.PasswordHash))
            {
                return new LoginOutputModel
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            if (!user.IsApproved)
            {
                return new LoginOutputModel
                {
                    Success = false,
                    Message = "Your account is pending approval"
                };
            }

            var token = GenerateJwtToken(user);

            return new LoginOutputModel
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = new UserOutputModel
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role.Name,
                    IsApproved = user.IsApproved
                }
            };
        }

        public async Task<RegisterOutputModel> RegisterAsync(RegisterInputModel model)
        {
            var existingUser = (await _userRepository.GetAllAsync(
                null,
                null,
                predicate: u => u.Email == model.Email
            )).Items.FirstOrDefault();

            if (existingUser != null)
            {
                return new RegisterOutputModel
                {
                    Success = false,
                    Message = "Email already registered"
                };
            }

            var role = (await _roleRepository.GetAllAsync(
                null,
                null,
                predicate: r => r.Name == model.Role
            )).Items.FirstOrDefault();

            if (role == null || role.Name == "Admin")
            {
                return new RegisterOutputModel
                {
                    Success = false,
                    Message = "Invalid role"
                };
            }

            var user = new ApplicationUser
            {
                Email = model.Email,
                PasswordHash = HashPassword(model.Password),
                FirstName = model.FirstName,
                LastName = model.LastName,
                RoleId = role.Id,
                IsApproved = false,
                AddSource = "Registration"
            };

            await _userRepository.AddAsync(user);

            return new RegisterOutputModel
            {
                Success = true,
                Message = $"Registration successful. Your account is pending {(model.Role == "Teacher" ? "admin" : "teacher")} approval."
            };
        }

        public async Task<UserOutputModel> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetAsync(userId, include => include.Include(u => u.Role));

            if (user == null)
                return null;

            return new UserOutputModel
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.Name,
                IsApproved = user.IsApproved
            };
        }

        public async Task<RegisterOutputModel> InitializeAdminAsync(string password)
        {
            var admin = (await _userRepository.GetAllAsync(
                null,
                null,
                predicate: u => u.Email == "admin@fitr.local"
            )).Items.FirstOrDefault();

            if (admin == null)
            {
                return new RegisterOutputModel
                {
                    Success = false,
                    Message = "Admin user not found. Run ADD_AUTH_TABLES.sql first."
                };
            }

            if (admin.PasswordHash != "TEMPORARY_HASH_UPDATE_VIA_API")
            {
                return new RegisterOutputModel
                {
                    Success = false,
                    Message = "Admin password already initialized."
                };
            }

            admin.PasswordHash = HashPassword(password);
            await _userRepository.UpdateAsync(admin, admin.Id);

            return new RegisterOutputModel
            {
                Success = true,
                Message = "Admin password initialized successfully. You can now login."
            };
        }

        private static static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private static bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? "YourSuperSecretKeyForJWTTokenGeneration123!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "FITR",
                audience: _configuration["Jwt:Audience"] ?? "FITR",
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
