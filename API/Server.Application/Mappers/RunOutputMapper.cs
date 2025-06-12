using Server.Application.Models.Output.Run;
using Server.Common.Enums;
using Server.Data.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace Server.Application.Mappers
{
    public static class RunOutputMapper
    {
        public static RunFlowListItemOutputModel MapToRunFlowListItemOutputModel(this Flow item)
        {
            if (item == null)
                return null;

            return new RunFlowListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name
            };
        }

        public static RunNodeListItemOutputModel MapToRunNodeListItemOutputModel(this Node item)
        {
            if (item == null)
                return null;

            return new RunNodeListItemOutputModel
            {
                Id = item.Id,
                Name = item.Name
            };
        }

        public static RunNodeOutputModel MapToRunNodeOutputModel(this Node item, FlowNode flowNode = null)
        {
            IEnumerable<RunPinValueOutputModel> GetPinValues(PinDirection direction) =>
                item.Pins.Where(x => x.Direction == direction).Select(
                    x => x.MapToRunNodePinOutputModel(
                        flowNode?.PinValues.FirstOrDefault(p => p.PinId == x.Id)));

            if (item == null)
                return null;

            return new RunNodeOutputModel
            {
                Id = flowNode?.Id ?? 0,
                NodeId = item.Id,
                Name = flowNode?.Name ?? item.Name,
                SubFlowId = flowNode?.SubFlowId,
                CommandType = item.CommandType,
                Command = item.Command,
                InputPins = GetPinValues(PinDirection.Input),
                OutputPins = GetPinValues(PinDirection.Output),
            };
        }

        public static RunPinValueOutputModel MapToRunNodePinOutputModel(this Pin item, PinValue pinValue = null)
        {
            if (item == null)
                return null;

            return new RunPinValueOutputModel
            {
                Id = pinValue?.Id ?? 0,
                FlowNodeId = pinValue?.FlowNodeId ?? 0,
                Value = pinValue?.Value,
                Name = item.Name,
                ValueType = item.ValueType,
                IsPublic = item.IsPublic,
                PinId = item.Id
            };
        }

        public static RunFlowOutputModel MapToRunFlowOutputModel(this Flow item)
        {
            if (item == null)
                return null;

            return new RunFlowOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Aliases = item.Aliases?.Select(x => x.MapToRunAliasOutputModel()),
                Nodes = item.FlowNodes?.Select(x => x.Node.MapToRunNodeOutputModel(x)),
                Connectors = item.Connectors?.Select(x => x.MapToRunConnectorOutputModel()),
            };
        }

        public static RunConnectorOutputModel MapToRunConnectorOutputModel(this Connector item)
        {
            if (item == null)
                return null;

            return new RunConnectorOutputModel
            {
                Id = item.Id,
                StartPinValueId = item.StartPinValueId,
                EndPinValueId = item.EndPinValueId
            };
        }

        public static RunAliasOutputModel MapToRunAliasOutputModel(this Alias item)
        {
            if (item == null)
                return null;

            return new RunAliasOutputModel
            {
                Id = item.Id,
                Name = item.Name,
                Direction = item.Direction,
                ValueType = item.ValueType,
                PinValueIds = item.PinValueAliases?.Select(x => x.PinValueId)
            };
        }
    }
}
