using Microsoft.AspNetCore.Http;

namespace Server.Common.Helpers
{
    public static class UserHttpContext
    {
        private static IHttpContextAccessor _contextAccessor;

        public static HttpContext Current => _contextAccessor?.HttpContext;
        public static string Username => Current?.User?.Identity?.Name;
        public static string Source
        {
            get
            {
                object value = null;
                Current?.Items?.TryGetValue(nameof(Source), out value);

                return value?.ToString();
            }
            set
            {
                if (Current?.Items != null)
                {
                    Current.Items[nameof(Source)] = value;
                }
            }
        }

        public static void Configure(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }
    }
}
