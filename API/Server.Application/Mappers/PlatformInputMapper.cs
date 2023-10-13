using Server.Application.Models.Input.Platform;
using Server.Data.Dtos;

namespace Server.Application.Mappers
{
    public static class PlatformInputMapper
    {
        public static Platform MapToPlatform(this PlatformInputModel item)
        {
            if (item == null)
                return null;

            return new Platform
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                Author = item.Author,
                IsActive = item.IsActive,
            };
        }

        public static Node MapToNode(this PlatformNodeInputModel item)
        {
            if (item == null)
                return null;

            return new Node
            {
                Id = item.Id,
                PlatformId = item.PlatformId,
                CommandType = item.CommandType,
                Command = item.Command,
                Name = item.Name,
                IsActive = item.IsActive,
            };
        }

        public static Pin MapToPin(this PlatformNodePinInputModel item)
        {
            if (item == null)
                return null;

            return new Pin
            {
                Id = item.Id,
                NodeId = item.NodeId,
                Name = item.Name,
                Direction = item.Direction,
                ValueType = item.ValueType,
                IsPublic = item.IsPublic
            };
        }
    }
}
