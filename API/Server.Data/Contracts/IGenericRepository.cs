using Microsoft.EntityFrameworkCore.Storage;
using Server.Common.Dtos;
using Server.Common.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Server.Data.Contracts
{
    public interface IGenericRepository<TEntity>
        where TEntity : Entity
    {
        Task<(ICollection<TEntity> Items, int Count)> GetAllAsync(FilterOptions options, Func<IQueryable<TEntity>, IQueryable<TEntity>> include = null, Expression<Func<TEntity, bool>> predicate = null);
        Task<TEntity> GetAsync(int id, Func<IQueryable<TEntity>, IQueryable<TEntity>> include = null);
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate);
        Task<TEntity> AddAsync(TEntity t);
        Task AddRangeAsync(IEnumerable<TEntity> entities);
        Task<TEntity> UpdateAsync(TEntity updated, int key);
        Task<int> DeleteAsync(TEntity t);
        Task<int> DeleteAsync(Expression<Func<TEntity, bool>> predicate);
        Task<int> CountAsync();
        Task<IDbContextTransaction> BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();

    }
}
