using Server.Application.Models.Input.Platform;
using Server.Application.Models.Output.Platform;
using Server.Common.Filters;
using Server.Common.Models;
using System.Threading.Tasks;

namespace Server.Application.Contracts
{
    public interface IPlatformService
    {
        Task<PlatformOutputModel> GetPlatformAsync(int id);
        Task<PlatformNodeOutputModel> GetNodeAsync(int id);
        Task<PlatformNodePinOutputModel> GetPinAsync(int id);
        Task<PagedModel<PlatformListItemOutputModel>> GetPlatformsAsync(FilterOptions options);
        Task<PagedModel<PlatformNodeListItemOutputModel>> GetNodesAsync(int platformId, FilterOptions options);
        Task<PagedModel<PlatformNodePinListItemOutputModel>> GetPinsAsync(int nodeId, FilterOptions options);
        Task<int> CreatePlatformAsync(PlatformInputModel model);
        Task<int> CreateNodeAsync(PlatformNodeInputModel model);
        Task<int> CreatePinAsync(PlatformNodePinInputModel model);
        Task UpdatePlatformAsync(PlatformInputModel model);
        Task UpdateNodeAsync(PlatformNodeInputModel model);
        Task UpdatePinAsync(PlatformNodePinInputModel model);
        Task DeletePlatformAsync(int id);
        Task DeleteNodeAsync(int id);
        Task DeletePinAsync(int id);
    }
}
