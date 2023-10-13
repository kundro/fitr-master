using System.Collections.Generic;
using System.Linq;

namespace Server.Common.Models
{
    public class GenericResult<T>
    {
        public GenericResult(T result)
        {
            Errors = new List<Error>();
            Result = result;
        }

        public T Result { get; }
        public bool IsSuccess => !Errors.Any();
        public List<Error> Errors { get; }

        public void AddError(params Error[] error)
        {
            Errors.AddRange(error);
        }
    }
}
