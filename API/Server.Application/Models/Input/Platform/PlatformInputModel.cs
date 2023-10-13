using Server.Common.Models;

namespace Server.Application.Models.Input.Platform
{
    public class PlatformInputModel : NamedModel
    {
        public string Description { get; set; }
        public string Author { get; set; }
        public bool IsActive { get; set; }
    }
}
