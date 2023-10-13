using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Server.Common.Dtos;
using Server.Common.Helpers;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Server.Data.Contexts
{
    public class ContextCore : DbContext
    {
        public ContextCore()
        {
        }

        public ContextCore([NotNull] DbContextOptions options) : base(options)
        {
        }

        private string HistoricalSource =>
            !string.IsNullOrWhiteSpace(UserHttpContext.Source)
            ? UserHttpContext.Source
            : !string.IsNullOrWhiteSpace(UserHttpContext.Username)
                ? UserHttpContext.Username
                : string.Empty;

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateHistorical(DateTime.UtcNow);
            var res = base.SaveChanges(acceptAllChangesOnSuccess);

            return res;
        }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = new CancellationToken())
        {
            UpdateHistorical(DateTime.UtcNow);
            var res = await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);

            return res;
        }

        private void UpdateHistorical(DateTime updateDate)
        {
            var selectedEntityList = ChangeTracker.Entries()
                .Where(x => x.Entity is HistoricalEntity &&
                            x.State == EntityState.Modified);

            foreach (var entityEntry in selectedEntityList)
            {
                var addDateProp = entityEntry.Property(nameof(HistoricalEntity.AddDate));
                var addSourceProp = entityEntry.Property(nameof(HistoricalEntity.AddSource));

                addDateProp.CurrentValue = addDateProp.OriginalValue;
                addSourceProp.CurrentValue = addSourceProp.OriginalValue;

                entityEntry.Property(nameof(HistoricalEntity.ChangeDate)).CurrentValue = updateDate;
                entityEntry.Property(nameof(HistoricalEntity.ChangeSource)).CurrentValue = HistoricalSource;
            }

            selectedEntityList = ChangeTracker.Entries()
                .Where(x => x.Entity is HistoricalEntity &&
                            x.State == EntityState.Added);

            foreach (var entityEntry in selectedEntityList)
            {
                entityEntry.Property(nameof(HistoricalEntity.AddDate)).CurrentValue = updateDate;
                entityEntry.Property(nameof(HistoricalEntity.AddSource)).CurrentValue = HistoricalSource;
            }
        }
    }
}
