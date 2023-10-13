using Server.Application.Models.Output.Run;
using Server.Common.Filters;
using Server.Common.Models;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IRunService
    {
        Task<RunFlowOutputModel> GetFlowAsync(int id);
        Task<RunNodeOutputModel> GetNodeAsync(int id);
        Task<PagedModel<RunFlowListItemOutputModel>> GetFlowsAsync(FilterOptions options);
        Task<PagedModel<RunNodeListItemOutputModel>> GetNodesAsync(FilterOptions options);
    }
}
