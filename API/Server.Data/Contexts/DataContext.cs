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
    }
}
