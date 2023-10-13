using Server.Application.Models.Input.Flow;
using Server.Application.Models.Output.Flow;
using Server.Common.Filters;
using Server.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IFlowService
    {
        Task<FlowOutputModel> GetFlowAsync(int id);
        Task<FlowOutputModel> GetFlowTemplateAsync();
        Task<PagedModel<FlowListItemOutputModel>> GetFlowsAsync(FilterOptions options);
        Task<FlowNodeOutputModel> GetNodeAsync(int id);
        Task<IEnumerable<FlowPlatformListItemOutputModel>> GetPlatformsListAsync(string filter, bool includeNodes);

        Task<int> CreateFlowAsync(FlowInputModel model);
        Task UpdateFlowAsync(FlowInputModel model);
        Task DeleteFlowAsync(int id);

        Task<IEnumerable<FlowsAsTasksListItemOutputModel>> GetFlowsListAsync(string filter);
    }
}
