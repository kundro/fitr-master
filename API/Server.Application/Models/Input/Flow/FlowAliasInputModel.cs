using Server.Common.Enums;
using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Input.Flow
{
    public class FlowAliasInputModel : NamedModel
    {
        public PinDirection Direction { get; set; }
        public PinValueType ValueType { get; set; }
        public IEnumerable<string> PinValueKeys { get; set; }
    }
}
