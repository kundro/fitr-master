using Server.Application.Models.Output.Flow;
using Server.Common.Enums;
using Server.Data.Dtos;
using System.Linq;

namespace Server.Application.Mappers
{
    public static class FlowOutputMapper
    {
        public static FlowOutputModel MapToFlowOutputModel(this Flow item)
        {
            if (item == null)
                return null;

            return new FlowOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                IsActive = item.IsActive,
                X = item.X,
                Y = item.Y,
                Aliases = item.Aliases?.Select(x => x.MapToFlowAliasOutputModel()),
                Nodes = item.FlowNodes?.Select(x => x.Node.MapToFlowNodeOutputModel(x)),
                Connectors = item.Connectors.Select(x => x.MapToFlowConnectorOutputModel()),
            };
        }

        public static FlowListItemOutputModel MapToFlowListItemOutputModel(this Flow item)
        {
            if (item == null)
                return null;

            return new FlowListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                IsActive = item.IsActive
            };
        }

        public static FlowPlatformListItemOutputModel MapToFlowPlatformListItemOutputModel(this Platform item)
        {
            if (item == null)
                return null;

            var res = new FlowPlatformListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Nodes = item.Nodes?.Select(x => x.MapToFlowNodeListItemOutputModel())
            };

            return res;
        }

        public static FlowNodeListItemOutputModel MapToFlowNodeListItemOutputModel(this Node item)
        {
            if (item == null)
                return null;

            var res = new FlowNodeListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name
            };

            return res;
        }

        public static FlowNodeOutputModel MapToFlowNodeOutputModel(this Node item, FlowNode flowNode = null)
        {
            if (item == null)
                return null;

            var res = new FlowNodeOutputModel
            {
                Id = flowNode?.Id ?? 0,
                NodeId = item.Id,
                Name = flowNode?.Name ?? item.Name,
                X = flowNode?.X ?? 0,
                Y = flowNode?.Y ?? 0,
                IsActive = item.IsActive,
                Command = item.Command,
                CommandType = item.CommandType,
                InputPins = item.Pins?.Where(x => x.Direction == PinDirection.Input)
                    .Select(x => x.MapToFlowPinOutputModel(
                        flowNode?.PinValues?.FirstOrDefault(p => x.Id == p.PinId))),
                OutputPins = item.Pins?.Where(x => x.Direction == PinDirection.Output)
                    .Select(x => x.MapToFlowPinOutputModel(
                        flowNode?.PinValues?.FirstOrDefault(p => x.Id == p.PinId))),
            };

            return res;
        }

        public static FlowPinOutputModel MapToFlowPinOutputModel(this Pin item, PinValue pinValue = null)
        {
            if (item == null)
                return null;

            var res = new FlowPinOutputModel
            {
                Id = pinValue?.Id ?? 0,
                NodeId = item.NodeId,
                FlowNodeId = pinValue?.FlowNodeId ?? 0,
                PinId = item.Id,
                Name = item.Name,
                ValueType = item.ValueType,
                Direction = item.Direction,
                Value = pinValue?.Value,
                IsPublic = item.IsPublic
            };

            return res;
        }

        public static FlowConnectorOutputModel MapToFlowConnectorOutputModel(this Connector item)
        {
            if (item == null)
                return null;

            var res = new FlowConnectorOutputModel
            {
                Id = item.Id,
                StartPinValueId = item.StartPinValueId,
                EndPinValueId = item.EndPinValueId,
            };

            return res;
        }

        public static FlowAliasOutputModel MapToFlowAliasOutputModel(this Alias item)
        {
            if (item == null)
                return null;

            var res = new FlowAliasOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Direction = item.Direction,
                ValueType = item.ValueType,
                PinValueIds = item.PinValueAliases?.Select(x => x.PinValueId)
            };

            return res;
        }
    }
}
