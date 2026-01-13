using Microsoft.EntityFrameworkCore;
using Server.Data.Dtos;
using System.Diagnostics.CodeAnalysis;

namespace Server.Data.Contexts
{
    public class DataContext : ContextCore
    {
        #region Ctor

        public DataContext()
        {
        }

        public DataContext([NotNull] DbContextOptions options) : base(options)
        {
        }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Node>(x =>
            {
                x.ToTable("Node");
            });

            modelBuilder.Entity<Pin>(x =>
            {
                x.ToTable("Pin");
            });

            modelBuilder.Entity<PinValue>(x =>
            {
                x.ToTable("PinValue");
                x.Ignore(prop => prop.Key);
            });

            modelBuilder.Entity<Platform>(x =>
            {
                x.ToTable("Platform");
            });

            modelBuilder.Entity<Flow>(x =>
            {
                x.ToTable("Flow");
            });

            modelBuilder.Entity<FlowNode>(x =>
            {
                x.ToTable("Flow_Node");
            });

            modelBuilder.Entity<Alias>(x =>
            {
                x.ToTable("Alias");
            });

            modelBuilder.Entity<PinValueAlias>(x =>
            {
                x.ToTable("PinValue_Alias");
            });

            modelBuilder.Entity<Connector>(x =>
            {
                x.ToTable("Connector");
            });

            modelBuilder.Entity<ApplicationUser>(x =>
            {
                x.ToTable("User");
                
                x.HasOne(u => u.Role)
                    .WithMany(r => r.Users)
                    .HasForeignKey(u => u.RoleId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.NoAction);

                x.HasOne(u => u.ApprovedByUser)
                    .WithMany()
                    .HasForeignKey(u => u.ApprovedBy)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<UserRole>(x =>
            {
                x.ToTable("User_Role");
            });

            modelBuilder.Entity<Assignment>(x =>
            {
                x.ToTable("Assignment");
                
                x.HasOne(a => a.Teacher)
                    .WithMany(u => u.CreatedAssignments)
                    .HasForeignKey(a => a.TeacherId)
                    .OnDelete(DeleteBehavior.NoAction);
                    
                x.HasOne(a => a.Flow)
                    .WithMany()
                    .HasForeignKey(a => a.FlowId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AssignmentSubmission>(x =>
            {
                x.ToTable("Assignment_Submission");
                
                x.HasOne(s => s.Assignment)
                    .WithMany(a => a.Submissions)
                    .HasForeignKey(s => s.AssignmentId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                x.HasOne(s => s.Student)
                    .WithMany(u => u.Submissions)
                    .HasForeignKey(s => s.StudentId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }

        public DbSet<Node> Nodes { get; set; }
        public DbSet<Pin> Pins { get; set; }
        public DbSet<PinValue> PinValues { get; set; }
        public DbSet<Alias> Aliases { get; set; }
        public DbSet<PinValueAlias> PinValueAliases { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<Flow> Flows { get; set; }
        public DbSet<FlowNode> FlowNodes { get; set; }
        public DbSet<Connector> Connectors { get; set; }
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<AssignmentSubmission> AssignmentSubmissions { get; set; }
    }
}
