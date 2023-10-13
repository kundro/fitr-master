using Server.Common.Enums;
using Server.Common.Models;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Server.Common.Services
{
    public class ErrorCollector
    {
        public ErrorCollector()
        {
            Errors = new List<Error>();
        }

        public List<Error> Errors { get; set; }

        public void AddError(AppError error)
        {
            Errors.Add(new Error(error));
        }

        public void AddError(string message, [CallerMemberName] string code = null, string innerMessage = null)
        {
            Errors.Add(new Error(code, message, innerMessage));
        }

        public GenericResult<TResult> GetResult<TResult>(TResult result)
        {
            var res = new GenericResult<TResult>(result);
            res.AddError(Errors.ToArray());

            return res;
        }

        public GenericResult<object> GetResult() 
            => GetResult<object>(null);
    }
}
