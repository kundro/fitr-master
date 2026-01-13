using Microsoft.EntityFrameworkCore;
using Server.Application.Contracts;
using Server.Application.Models.Output.Auth;
using Server.Data.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserRoleRepository _roleRepository;

        public AdminService(
            IUserRepository userRepository,
            IUserRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        public async Task<IEnumerable<PendingUserOutputModel>> GetPendingTeachersAsync()
        {
            var teacherRole = (await _roleRepository.GetAllAsync(
                null,
                null,
                predicate: r => r.Name == "Teacher"
            )).Items.FirstOrDefault();

            if (teacherRole == null)
                return Enumerable.Empty<PendingUserOutputModel>();

            var pendingTeachers = (await _userRepository.GetAllAsync(
                null,
                include => include.Include(u => u.Role),
                predicate: u => u.RoleId == teacherRole.Id && !u.IsApproved
            )).Items;

            return pendingTeachers.Select(u => new PendingUserOutputModel
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role.Name,
                RegisteredDate = u.AddDate ?? DateTime.UtcNow
            });
        }

        public async Task ApproveTeacherAsync(int teacherId, int adminId)
        {
            var teacher = await _userRepository.GetAsync(teacherId);
            if (teacher == null)
                throw new InvalidOperationException($"Teacher with ID {teacherId} not found");

            teacher.IsApproved = true;
            teacher.ApprovedBy = adminId;
            teacher.ApprovedDate = DateTime.Now;
            teacher.ChangeSource = "Admin";
            teacher.ChangeDate = DateTime.Now;

            await _userRepository.UpdateAsync(teacher, teacherId);
        }

        public async Task RejectTeacherAsync(int teacherId)
        {
            var teacher = await _userRepository.GetAsync(teacherId);
            if (teacher == null)
                throw new InvalidOperationException($"Teacher with ID {teacherId} not found");

            await _userRepository.DeleteAsync(teacher);
        }
    }
}
