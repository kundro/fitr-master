using Server.Common.Enums;
using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Run
{
    public class RunAliasOutputModel : NamedModel
    {
        public PinDirection Direction { get; set; }
        public PinValueType ValueType { get; set; }
        public IEnumerable<int> PinValueIds { get; set; }
    }
}
