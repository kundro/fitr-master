using Server.Common.Enums;
using Server.Common.ExtensionMethods;
using System.Diagnostics.CodeAnalysis;

namespace Server.Common.Models
{
    public class Error
    {
        public Error([NotNull] string code, [NotNull] string message, string innerMessage = null)
        {
            Code = code;
            Message = message;
            InnerMessage = innerMessage;
        }

        public Error(AppError error)
        {
            Code = error.ToString();
            Message = error.GetDescription();
        }

        public string Code { get; }
        public string Message { get; }
        public string InnerMessage { get; }
    }
}
