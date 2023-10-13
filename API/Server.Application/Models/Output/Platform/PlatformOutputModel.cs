using Server.Common.Models;
using System.Collections.Generic;

namespace Server.Application.Models.Output.Platform
{
    public class PlatformOutputModel : NamedModel
    {
        public string Description { get; set; }
        public string Author { get; set; }
        public bool IsActive { get; set; }
        public IEnumerable<PlatformNodeOutputModel> Nodes { get; set; }
    }
}
