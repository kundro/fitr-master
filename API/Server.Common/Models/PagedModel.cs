using System.Collections.Generic;
using System.Linq;

namespace Server.Common.Models
{
    public class PagedModel<T>
        where T : Model
    {
        public PagedModel(IEnumerable<T> items, int count)
        {
            Items = items ?? Enumerable.Empty<T>();
            Count = count;
        }

        public IEnumerable<T> Items { get; }
        public int Count { get; }
    }
}
