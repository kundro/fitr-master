using Microsoft.EntityFrameworkCore;
using Server.Application.Contracts;
using Server.Application.Mappers;
using Server.Application.Models.Input.Flow;
using Server.Application.Models.Output.Flow;
using Server.Common.Enums;
using Server.Common.Filters;
using Server.Common.Models;
using Server.Data.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class FlowService : IFlowService
    {
        private readonly IFlowRepository _flowRepository;
        private readonly IPlatformRepository _platformRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly IConnectorRepository _connectorRepository;
        private readonly IAliasRepository _aliasRepository;

        public FlowService(
            IFlowRepository flowRepository,
            IPlatformRepository platformRepository,
            INodeRepository nodeRepository,
            IConnectorRepository connectorRepository,
            IAliasRepository aliasRepository)
        {
            _flowRepository = flowRepository;
            _platformRepository = platformRepository;
            _nodeRepository = nodeRepository;
            _connectorRepository = connectorRepository;
            _aliasRepository = aliasRepository;
        }

        public async Task<FlowOutputModel> GetFlowAsync(int id)
        {
            var res = await _flowRepository.GetAsync(id, include =>
                include.Include(x => x.FlowNodes)
                        .ThenInclude(x => x.Node)
                        .ThenInclude(x => x.Pins)
                    .Include(x => x.FlowNodes)
                        .ThenInclude(x => x.PinValues)
                    .Include(x => x.FlowNodes)
                        .ThenInclude(x => x.SubFlow)
                    .Include(x => x.Aliases)
                        .ThenInclude(x => x.PinValueAliases)
                    .Include(x => x.Connectors)
                        );

            return res?.MapToFlowOutputModel();
        }

        public async Task<FlowOutputModel> GetFlowTemplateAsync()
        {
            var inputNode = (await _nodeRepository.GetAsync(1,
                include => include.Include(x => x.Pins))
                ).MapToFlowNodeOutputModel();

            var outputNode = (await _nodeRepository.GetAsync(2,
                include => include.Include(x => x.Pins))
                ).MapToFlowNodeOutputModel();

            var res = new FlowOutputModel
            {
                Name = "New Flow",
                Nodes = new[] { inputNode, outputNode },
                IsActive = true
            };

            return res;
        }

        public async Task<PagedModel<FlowListItemOutputModel>> GetFlowsAsync(FilterOptions options)
        {
            var res = await _flowRepository.GetAllAsync(options,
                predicate: x
                => string.IsNullOrWhiteSpace(options.Filter)
                || x.Name.Contains(options.Filter)
                );

            return new PagedModel<FlowListItemOutputModel>(res.Items.Select(x => x.MapToFlowListItemOutputModel()), res.Count);
        }

        public async Task<IEnumerable<FlowPlatformListItemOutputModel>> GetPlatformsListAsync(string filter, bool includeNodes)
        {
            var res = await _platformRepository.GetAllAsync(null,
                includeNodes
                ? include => include.Include(x => x.Nodes.Where(node => node.Name.Contains(filter) 
                    && !(node.CommandType == NodeCommandType.Code 
                        && (node.Command == "FLOW_IN" || node.Command == "FLOW_OUT")
                        )))
                : null,
                predicate => predicate.Name.Contains(filter) || predicate.Nodes.Any(x => x.Name.Contains(filter)));

            return res.Items?.Select(x => x.MapToFlowPlatformListItemOutputModel());
        }

        public async Task<FlowNodeOutputModel> GetNodeAsync(int id)
        {
            var res = await _nodeRepository.GetAsync(id, include => include.Include(x => x.Pins));

            return res?.MapToFlowNodeOutputModel();
        }

        public async Task<int> CreateFlowAsync(FlowInputModel model)
        {
            var dto = model.MapToFlow();

            if (dto != null)
            {
                try
                {
                    await _flowRepository.BeginTransactionAsync();
                    await _flowRepository.AddAsync(dto);

                    var pinValues = dto.FlowNodes.SelectMany(x => x.PinValues);
                    var connectors = model.Connectors.Select(x => x.MapToConnector(dto.Id, pinValues)).ToList();
                    var aliases = model.Aliases.Select(x => x.MapToAlias(dto.Id, pinValues)).ToList();

                    await _connectorRepository.AddRangeAsync(connectors);
                    await _aliasRepository.AddRangeAsync(aliases);
                    await _flowRepository.CommitTransactionAsync();
                }
                catch
                {
                    await _flowRepository.RollbackTransactionAsync();
                    throw;
                }
            }

            return dto?.Id ?? 0;
        }

        public async Task UpdateFlowAsync(FlowInputModel model)
        {
            //var dto = model.MapToFlow();

            //if (dto != null)
            //{
            //}
        }

        public async Task DeleteFlowAsync(int id)
        {
            var dto = await _flowRepository.GetAsync(id, include =>
                include.Include(x => x.FlowNodes)
                        .ThenInclude(x => x.PinValues)
                       .Include(x => x.Aliases)
                        .ThenInclude(x => x.PinValueAliases)
                       .Include(x => x.Connectors)
                        );

            if (dto != null)
            {
                await _flowRepository.DeleteAsync(dto);
            }
        }

        public async Task<IEnumerable<FlowsAsTasksListItemOutputModel>> GetFlowsListAsync(string filter)
        {
            var result = new List<FlowsAsTasksListItemOutputModel>();
            var res = await _flowRepository.GetAllAsync(null, null,
                predicate => predicate.Name.Contains(filter));
            result.Add(
                new FlowsAsTasksListItemOutputModel
                {
                    Id = 0,
                    Name = "Flows",
                    Flows = res.Items.Select(x => x.MapToFlowListItemOutputModel())
                }
            );

            return result;
        }
    }
}
