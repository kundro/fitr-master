using Microsoft.EntityFrameworkCore;
using Server.Application.Contracts;
using Server.Application.Models.Input.Assignment;
using Server.Application.Models.Output.Assignment;
using Server.Data.Contracts;
using Server.Data.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class StudentService : IStudentService
    {
        private readonly IAssignmentRepository _assignmentRepository;
        private readonly IAssignmentSubmissionRepository _submissionRepository;

        public StudentService(
            IAssignmentRepository assignmentRepository,
            IAssignmentSubmissionRepository submissionRepository)
        {
            _assignmentRepository = assignmentRepository;
            _submissionRepository = submissionRepository;
        }

        public async Task<IEnumerable<AssignmentOutputModel>> GetMyAssignmentsAsync(int studentId)
        {
            var assignments = (await _assignmentRepository.GetAllAsync(
                null,
                include => include
                    .Include(a => a.Teacher)
                    .Include(a => a.Flow),
                predicate: a => a.IsActive
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

        public async Task<SubmissionOutputModel> GetMySubmissionAsync(int assignmentId, int studentId)
        {
            var submission = (await _submissionRepository.GetAllAsync(
                null,
                include => include
                    .Include(s => s.Student)
                    .Include(s => s.Assignment),
                predicate: s => s.AssignmentId == assignmentId && s.StudentId == studentId
            )).Items.FirstOrDefault();

            if (submission == null)
                return null;

            return new SubmissionOutputModel
            {
                Id = submission.Id,
                AssignmentId = submission.AssignmentId,
                StudentName = $"{submission.Student.FirstName} {submission.Student.LastName}",
                Status = submission.Status,
                SubmittedDate = submission.SubmittedDate,
                GradedDate = submission.GradedDate,
                Score = submission.Score,
                TeacherFeedback = submission.TeacherFeedback,
                FlowData = submission.FlowData
            };
        }

        public async Task<int> SubmitAssignmentAsync(SubmitAssignmentInputModel model, int studentId)
        {
            var existing = (await _submissionRepository.GetAllAsync(
                null,
                null,
                predicate: s => s.AssignmentId == model.AssignmentId && s.StudentId == studentId
            )).Items.FirstOrDefault();

            if (existing != null)
            {
                existing.FlowData = model.FlowData;
                existing.Status = "Submitted";
                existing.SubmittedDate = DateTime.Now;
                existing.ChangeSource = "Student";
                existing.ChangeDate = DateTime.Now;

                await _submissionRepository.UpdateAsync(existing, existing.Id);
                return existing.Id;
            }
            else
            {
                var submission = new AssignmentSubmission
                {
                    AssignmentId = model.AssignmentId,
                    StudentId = studentId,
                    FlowData = model.FlowData,
                    Status = "Submitted",
                    SubmittedDate = DateTime.Now,
                    AddSource = "Student"
                };

                var created = await _submissionRepository.AddAsync(submission);
                return created.Id;
            }
        }
    }
}
