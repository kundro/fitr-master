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
                
                // Configure the relationship to FlowSubFlow (nullable)
                x.HasOne(fn => fn.FlowSubFlow)
                    .WithMany(fs => fs.FlowNodes)
                    .HasForeignKey(fn => fn.FlowSubFlowId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
                    
                // Configure the relationship to SubFlow (nullable)
                x.HasOne(fn => fn.SubFlow)
                    .WithMany()
                    .HasForeignKey(fn => fn.SubFlowId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.SetNull);
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

            modelBuilder.Entity<FlowSubFlow>(x =>
            {
                x.ToTable("Flow_SubFlow");
                
                // Configure the relationship between parent Flow and FlowSubFlow
                x.HasOne(fs => fs.ParentFlow)
                    .WithMany(f => f.SubFlows)
                    .HasForeignKey(fs => fs.ParentFlowId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                // Configure the relationship to the sub flow
                x.HasOne(fs => fs.SubFlow)
                    .WithMany()
                    .HasForeignKey(fs => fs.SubFlowId)
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
        public DbSet<FlowSubFlow> FlowSubFlows { get; set; }
    }
}
