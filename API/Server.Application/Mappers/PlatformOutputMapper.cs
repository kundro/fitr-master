using Server.Application.Models.Output.Platform;
using Server.Data.Dtos;
using System.Linq;

namespace Server.Application.Mappers
{
    public static class PlatformOutputMapper
    {
        public static PlatformOutputModel MapToPlatformOutputModel(this Platform item)
        {
            if (item == null)
                return null;

            var res = new PlatformOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Author = item.Author,
                Description = item.Description,
                IsActive = item.IsActive,
                Nodes = item.Nodes?.Select(x => x.MapToPlatformNodeOutputModel()).ToList()
            };

            return res;
        }

        public static PlatformListItemOutputModel MapToPlatformListItemOutputModel(this Platform item)
        {
            if (item == null)
                return null;

            var res = new PlatformListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Author = item.Author,
                Description = item.Description,
                IsActive = item.IsActive,
            };

            return res;
        }

        public static PlatformNodeOutputModel MapToPlatformNodeOutputModel(this Node item)
        {
            if (item == null)
                return null;

            var res = new PlatformNodeOutputModel
            {
                Id = item.Id,
                PlatformId = item.PlatformId,
                Name = item.Name,
                CommandType = item.CommandType,
                Command = item.Command,
                IsActive = item.IsActive
            };

            return res;
        }

        public static PlatformNodeListItemOutputModel MapToPlatformNodeListItemOutputModel(this Node item)
        {
            if (item == null)
                return null;

            var res = new PlatformNodeListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                IsActive = item.IsActive
            };

            return res;
        }

        public static PlatformNodePinOutputModel MapToPlatformNodePinOutputModel(this Pin item)
        {
            if (item == null)
                return null;

            var res = new PlatformNodePinOutputModel
            {
                Id = item.Id,
                NodeId = item.NodeId,
                Name = item.Name,
                Direction = item.Direction,
                ValueType = item.ValueType,
                IsPublic = item.IsPublic
            };

            return res;
        }

        public static PlatformNodePinListItemOutputModel MapToPlatformNodePinListItemOutputModel(this Pin item)
        {
            if (item == null)
                return null;

            var res = new PlatformNodePinListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Direction = item.Direction
            };

            return res;
        }
    }
}
