using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Server.Common.Dtos;
using Server.Common.ExtensionMethods;
using Server.Common.Filters;
using Server.Data.Contexts;
using Server.Data.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Server.Data.Repositores
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity>
        where TEntity : Entity    {
        protected DataContext _context;

        public GenericRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<(ICollection<TEntity> Items, int Count)> GetAllAsync(FilterOptions options, Func<IQueryable<TEntity>, IQueryable<TEntity>> include = null, Expression<Func<TEntity, bool>> predicate = null)
        {
            IQueryable<TEntity> set = _context
                .Set<TEntity>()
                .AsNoTracking();

            if (include != null)
            {
                set = include(set);
            }

            var items = await ApplyFilter(set, options, out var total, predicate).ToListAsync();
            int count = await total.CountAsync();

            return (items, count);
        }

        public async Task<TEntity> GetAsync(int id, Func<IQueryable<TEntity>, IQueryable<TEntity>> include = null)
        {
            IQueryable<TEntity> set = _context.Set<TEntity>();

            if (include != null)
            {
                set = include(set);
            }

            return await set.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _context.Set<TEntity>().SingleOrDefaultAsync(predicate);
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            if (entity == null)
                return null;
                   
            _context.Set<TEntity>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task AddRangeAsync(IEnumerable<TEntity> entities)
        {
            entities = entities.EmptyIfNull().NotNullItems();

            await _context.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public async Task<TEntity> UpdateAsync(TEntity entity, int key)
        {
            if (entity == null)
                return null;

            TEntity existing = await _context.Set<TEntity>().FindAsync(key);
        
            if (existing != null)
            {
                _context.Entry(existing).CurrentValues.SetValues(entity);
                await _context.SaveChangesAsync();
            }
            return existing;
        }

        public async Task<int> DeleteAsync(TEntity t)
        {
            _context.Set<TEntity>().Remove(t);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var items = await _context.Set<TEntity>().Where(predicate).ToListAsync();
            _context.Set<TEntity>().RemoveRange(items);

            return await _context.SaveChangesAsync();
        }

        public async Task<int> CountAsync()
        {
            return await _context.Set<TEntity>().CountAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }

        private IQueryable<TEntity> ApplyFilter(IQueryable<TEntity> set, FilterOptions options, out IQueryable<TEntity> total,
                                                Expression<Func<TEntity, bool>> predicate = null)
        {
            if (predicate != null)
            {
                set = set.Where(predicate);
            }

            total = set;

            if (options != null)
            {
                set = set
                    .Skip(options.Skip)
                    .Take(options.Take);
            }

            return set;
        }    
    }
}
