using Microsoft.EntityFrameworkCore;
using Server.Application.Contracts;
using Server.Application.Models.Input.Assignment;
using Server.Application.Models.Output.Assignment;
using Server.Application.Models.Output.Auth;
using Server.Data.Contracts;
using Server.Data.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserRoleRepository _roleRepository;
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IAssignmentSubmissionRepository _submissionRepository;
        private readonly IFlowRepository _flowRepository;

        public TeacherService(
            IUserRepository userRepository,
            IUserRoleRepository roleRepository,
            IAssignmentRepository assignmentRepository,
            IAssignmentSubmissionRepository submissionRepository,
            IFlowRepository flowRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _assignmentRepository = assignmentRepository;
            _submissionRepository = submissionRepository;
            _flowRepository = flowRepository;
        }

        public async Task<IEnumerable<PendingUserOutputModel>> GetPendingStudentsAsync(int teacherId)
        {
            var studentRole = (await _roleRepository.GetAllAsync(
                null,
                null,
                predicate: r => r.Name == "Student"
            )).Items.FirstOrDefault();

            if (studentRole == null)
                return Enumerable.Empty<PendingUserOutputModel>();

            var pendingStudents = (await _userRepository.GetAllAsync(
                null,
                include => include.Include(u => u.Role),
                predicate: u => u.RoleId == studentRole.Id && !u.IsApproved
            )).Items;

            return pendingStudents.Select(u => new PendingUserOutputModel
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = u.Role.Name,
                RegisteredDate = u.AddDate
            });
        }

        public async Task ApproveStudentAsync(int studentId, int teacherId)
        {
            var student = await _userRepository.GetAsync(studentId);
            if (student == null)
                throw new Exception("Student not found");

            student.IsApproved = true;
            student.ApprovedBy = teacherId;
            student.ApprovedDate = DateTime.Now;
            student.ChangeSource = "Teacher";
            student.ChangeDate = DateTime.Now;

            await _userRepository.UpdateAsync(student, studentId);
        }

        public async Task RejectStudentAsync(int studentId)
        {
            var student = await _userRepository.GetAsync(studentId);
            if (student == null)
                throw new Exception("Student not found");

            await _userRepository.DeleteAsync(student);
        }

        public async Task<int> CreateAssignmentAsync(CreateAssignmentInputModel model, int teacherId)
        {
            var flow = await _flowRepository.GetAsync(model.FlowId);
            if (flow == null)
                throw new Exception("Flow not found");

            var assignment = new Assignment
            {
                TeacherId = teacherId,
                FlowId = model.FlowId,
                Title = model.Title,
                Description = model.Description,
                DueDate = model.DueDate,
                MaxScore = model.MaxScore,
                IsActive = true,
                AddSource = "Teacher"
            };

            var created = await _assignmentRepository.AddAsync(assignment);
            return created.Id;
        }

        public async Task<IEnumerable<AssignmentOutputModel>> GetMyAssignmentsAsync(int teacherId)
        {
            var assignments = (await _assignmentRepository.GetAllAsync(
                null,
                include => include
                    .Include(a => a.Teacher)
                    .Include(a => a.Flow),
                predicate: a => a.TeacherId == teacherId
            )).Items;

            return assignments.Select(a => new AssignmentOutputModel
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                DueDate = a.DueDate,
                MaxScore = a.MaxScore,
                IsActive = a.IsActive,
                TeacherName = $"{a.Teacher.FirstName} {a.Teacher.LastName}",
                FlowName = a.Flow.Name,
                FlowId = a.FlowId
            });
        }

        public async Task<IEnumerable<SubmissionOutputModel>> GetAssignmentSubmissionsAsync(int assignmentId)
        {
            var submissions = (await _submissionRepository.GetAllAsync(
                null,
                include => include
                    .Include(s => s.Student)
                    .Include(s => s.Assignment),
                predicate: s => s.AssignmentId == assignmentId
            )).Items;

            return submissions.Select(s => new SubmissionOutputModel
            {
                Id = s.Id,
                AssignmentId = s.AssignmentId,
                StudentName = $"{s.Student.FirstName} {s.Student.LastName}",
                Status = s.Status,
                SubmittedDate = s.SubmittedDate,
                GradedDate = s.GradedDate,
                Score = s.Score,
                TeacherFeedback = s.TeacherFeedback,
                FlowData = s.FlowData
            });
        }

        public async Task GradeSubmissionAsync(int submissionId, GradeSubmissionInputModel model)
        {
            var submission = await _submissionRepository.GetAsync(submissionId);
            if (submission == null)
                throw new Exception("Submission not found");

            submission.Score = model.Score;
            submission.TeacherFeedback = model.TeacherFeedback;
            submission.Status = "Graded";
            submission.GradedDate = DateTime.Now;
            submission.ChangeSource = "Teacher";
            submission.ChangeDate = DateTime.Now;

            await _submissionRepository.UpdateAsync(submission, submissionId);
        }
    }
}
