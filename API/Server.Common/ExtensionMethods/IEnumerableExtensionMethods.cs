using System;
using System.Collections.Generic;
using System.Linq;

namespace Server.Common.ExtensionMethods
{
    public static class IEnumerableExtensionMethods
    {
        public static bool SafeAny<TSource>(this IEnumerable<TSource> source)
            => source?.Any() ?? false;

        public static bool SafeAny<TSource>(this IEnumerable<TSource> source, Func<TSource, bool> predicate)
            => source?.Any(predicate) ?? false;

        public static IEnumerable<TSource> EmptyIfNull<TSource>(this IEnumerable<TSource> source)
            => source ?? Enumerable.Empty<TSource>();

        public static IEnumerable<TSource> NotNullItems<TSource>(this IEnumerable<TSource> source)
            => source.Where(x => x != null);
    }
}
