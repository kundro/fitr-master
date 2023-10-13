using Server.Application.Models.Input.Flow;
using Server.Data.Dtos;
using System.Collections.Generic;
using System.Linq;

namespace Server.Application.Mappers
{
    public static class FlowInputMapper
    {
        public static Flow MapToFlow(this FlowInputModel item)
        {
            if (item == null)
                return null;

            return new Flow
            {
                Id = item.Id,
                Name = item.Name,
                IsActive = item.IsActive,
                Aliases = null,
                Connectors = null,
                FlowNodes = item.FlowNodes.Select(x => x.MapToFlowNode()).ToList(),
                X = item.X,
                Y = item.Y,
            };
        }

        public static FlowNode MapToFlowNode(this FlowNodeInputModel item)
        {
            if (item == null)
                return null;

            return new FlowNode
            {
                Id = item.Id,
                NodeId = item.NodeId,
                Name = item.Name,
                PinValues = item.PinValues.Select(x => x.MapToPinValue()).ToList(),
                X = item.X,
                Y = item.Y,
            };
        }

        public static PinValue MapToPinValue(this FlowNodePinValueInputModel item)
        {
            if (item == null)
                return null;

            return new PinValue
            {
                Key = item.Key,
                Id = item.Id,
                PinId = item.PinId,
                Value = item.Value ?? ""
            };
        }

        public static Alias MapToAlias(this FlowAliasInputModel item, int flowId, IEnumerable<PinValue> pinValues)
        {
            if (item == null || pinValues == null)
                return null;

            var pinValueAliases = new List<PinValueAlias>();

            foreach (var pinValue in pinValues)
            {
                if (item.PinValueKeys.Contains(pinValue?.Key))
                {
                    pinValueAliases.Add(new PinValueAlias
                    {
                        Id = 0,
                        AliasId = 0,
                        PinValueId = pinValue.Id
                    });
                }
            }

            return new Alias
            {
                Id = -item.Id,
                FlowId = flowId,
                Name = item.Name,
                Direction = item.Direction,
                ValueType = item.ValueType,
                PinValueAliases = pinValueAliases
            };
        }

        public static Connector MapToConnector(this FlowConnectorInputModel item, int flowId, IEnumerable<PinValue> pinValues)
        {
            if (item == null || pinValues == null)
                return null;

            var startPinValue = pinValues.FirstOrDefault(x => x.Key == item.StartPinValueKey);
            var endPinValue = pinValues.FirstOrDefault(x => x.Key == item.EndPinValueKey);

            if (startPinValue == null || endPinValue == null)
                return null;

            return new Connector
            {
                Id = item.Id,
                FlowId = flowId,
                StartPinValueId = startPinValue.Id,
                EndPinValueId = endPinValue.Id
            };
        }
    }
}
