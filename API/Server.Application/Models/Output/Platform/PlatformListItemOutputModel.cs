using Server.Common.Models;

namespace Server.Application.Models.Output.Platform
{
    public class PlatformListItemOutputModel : NamedModel
    {
        public string Author { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}
