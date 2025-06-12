using Microsoft.EntityFrameworkCore;
using Server.Application.Contracts;
using Server.Application.Mappers;
using Server.Application.Models.Output.Run;
using Server.Common.Filters;
using Server.Common.Models;
using Server.Data.Contracts;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class RunService : IRunService
    {
        private readonly IFlowRepository _flowRepository;
        private readonly INodeRepository _nodeRepository;

        public RunService(IFlowRepository flowRepository, INodeRepository nodeRepository)
        {
            _flowRepository = flowRepository;
            _nodeRepository = nodeRepository;
        }

        public async Task<RunFlowOutputModel> GetFlowAsync(int id)
        {
            var res = await _flowRepository.GetAsync(id, include => 
                include.Include(x => x.Aliases)
                        .ThenInclude(x => x.PinValueAliases)
                       .Include(x => x.FlowNodes)
                       .ThenInclude(x => x.Node)
                        .ThenInclude(x => x.Pins)
                       .Include(x => x.FlowNodes)
                        .ThenInclude(x => x.PinValues)
                       .Include(x => x.FlowNodes)
                        .ThenInclude(x => x.SubFlow)
                       .Include(x => x.Connectors)
                );

            return res?.MapToRunFlowOutputModel();
        }

        public async Task<PagedModel<RunFlowListItemOutputModel>> GetFlowsAsync(FilterOptions options)
        {
            var res = await _flowRepository.GetAllAsync(options, predicate: x
              => string.IsNullOrWhiteSpace(options.Filter)
              || x.Name.Contains(options.Filter)
              );

            return new PagedModel<RunFlowListItemOutputModel>(res.Items.Select(x => x.MapToRunFlowListItemOutputModel()), res.Count);
        }

        public async Task<RunNodeOutputModel> GetNodeAsync(int id)
        {
            var res = await _nodeRepository.GetAsync(id, include => include.Include(x => x.Pins));

            return res?.MapToRunNodeOutputModel();
        }

        public async Task<PagedModel<RunNodeListItemOutputModel>> GetNodesAsync(FilterOptions options)
        {
            var res = await _nodeRepository.GetAllAsync(options, predicate: x
              => (string.IsNullOrWhiteSpace(options.Filter) || x.Name.Contains(options.Filter)) 
              && !new [] {1,2}.Contains(x.Id)
              && x.IsActive == true
              );

            return new PagedModel<RunNodeListItemOutputModel>(res.Items.Select(x => x.MapToRunNodeListItemOutputModel()), res.Count);
        }
    }
}
