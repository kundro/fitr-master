using Microsoft.AspNetCore.Identity;
using Server.Common.Dtos;
using System;
using System.Collections.Generic;

namespace Server.Data.Dtos
{
    public class ApplicationUser : HistoricalEntity
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int RoleId { get; set; }
        public bool IsApproved { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }

        public UserRole Role { get; set; }
        public ApplicationUser ApprovedByUser { get; set; }
        public ICollection<Assignment> CreatedAssignments { get; set; }
        public ICollection<AssignmentSubmission> Submissions { get; set; }
    }
}
