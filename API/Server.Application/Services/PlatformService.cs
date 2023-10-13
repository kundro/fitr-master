using Microsoft.EntityFrameworkCore;
using Server.Application.Contracts;
using Server.Application.Mappers;
using Server.Application.Models.Input.Platform;
using Server.Application.Models.Output.Platform;
using Server.Common.Filters;
using Server.Common.Models;
using Server.Data.Contracts;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Application.Services
{
    public class PlatformService : IPlatformService
    {
        private readonly IPlatformRepository _platformRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly IPinRepository _pinRepository;

        public PlatformService(IPlatformRepository platformRepository, INodeRepository nodeRepository, IPinRepository pinRepository)
        {
            _platformRepository = platformRepository;
            _nodeRepository = nodeRepository;
            _pinRepository = pinRepository;
        }

        #region Platform

        public async Task<PlatformOutputModel> GetPlatformAsync(int id)
        {
            var res = await _platformRepository.GetAsync(id);

            return res.MapToPlatformOutputModel();
        }

        public async Task<PagedModel<PlatformListItemOutputModel>> GetPlatformsAsync(FilterOptions options)
        {
            var res = await _platformRepository.GetAllAsync(options, predicate: x
                => string.IsNullOrWhiteSpace(options.Filter)
                || x.Name.Contains(options.Filter)
                || x.Description.Contains(options.Filter)
                || x.Author.Contains(options.Filter)
                );

            return new PagedModel<PlatformListItemOutputModel>(res.Items.Select(x => x.MapToPlatformListItemOutputModel()), res.Count);
        }

        public async Task<int> CreatePlatformAsync(PlatformInputModel model)
        {
            var dto = model.MapToPlatform();

            if (dto != null)
            {
                await _platformRepository.AddAsync(dto);
            }

            return dto?.Id ?? 0;
        }

        public async Task UpdatePlatformAsync(PlatformInputModel model)
        {
            var dto = model.MapToPlatform();

            if (dto != null)
            {
                await _platformRepository.UpdateAsync(dto, dto.Id);
            }
        }

        public async Task DeletePlatformAsync(int id)
        {
            var dto = await _platformRepository.GetAsync(id, 
                include => include.Include(x => x.Nodes)
                    .ThenInclude(x => x.Pins));

            if (dto != null)
            {
                await _platformRepository.DeleteAsync(dto);
            }
        }

        #endregion

        #region Node

        public async Task<PlatformNodeOutputModel> GetNodeAsync(int id)
        {
            var res = await _nodeRepository.GetAsync(id);

            return res.MapToPlatformNodeOutputModel();
        }

        public async Task<PagedModel<PlatformNodeListItemOutputModel>> GetNodesAsync(int platformId, FilterOptions options)
        {
            var res = await _nodeRepository.GetAllAsync(options, predicate: x
                => x.PlatformId == platformId
                && (string.IsNullOrWhiteSpace(options.Filter) || x.Name.Contains(options.Filter)));

            return new PagedModel<PlatformNodeListItemOutputModel>(res.Items.Select(x => x.MapToPlatformNodeListItemOutputModel()), res.Count);
        }

        public async Task<int> CreateNodeAsync(PlatformNodeInputModel model)
        {
            var dto = model.MapToNode();

            if (dto != null)
            {
                await _nodeRepository.AddAsync(dto);
            }

            return dto?.Id ?? 0;
        }

        public async Task UpdateNodeAsync(PlatformNodeInputModel model)
        {
            var dto = model.MapToNode();

            if (dto != null)
            {
                await _nodeRepository.UpdateAsync(dto, dto.Id);
            }
        }

        public async Task DeleteNodeAsync(int id)
        {
            var dto = await _nodeRepository.GetAsync(id, 
                include => include.Include(x => x.Pins));

            if (dto != null)
            {
                await _nodeRepository.DeleteAsync(dto);
            }
        }

        #endregion

        #region Pin

        public async Task<PlatformNodePinOutputModel> GetPinAsync(int id)
        {
            var res = await _pinRepository.GetAsync(id);

            return res.MapToPlatformNodePinOutputModel();
        }

        public async Task<PagedModel<PlatformNodePinListItemOutputModel>> GetPinsAsync(int nodeId, FilterOptions options)
        {
            var res = await _pinRepository.GetAllAsync(options, predicate: x
            => x.NodeId == nodeId
            && (string.IsNullOrWhiteSpace(options.Filter) || x.Name.Contains(options.Filter)));

            return new PagedModel<PlatformNodePinListItemOutputModel>(res.Items.Select(x => x.MapToPlatformNodePinListItemOutputModel()), res.Count);
        }

        public async Task<int> CreatePinAsync(PlatformNodePinInputModel model)
        {
            var dto = model.MapToPin();

            if (dto != null)
            {
                await _pinRepository.AddAsync(dto);
            }

            return dto?.Id ?? 0;
        }

        public async Task UpdatePinAsync(PlatformNodePinInputModel model)
        {
            var dto = model.MapToPin();

            if (dto != null)
            {
                await _pinRepository.UpdateAsync(dto, dto.Id);
            }
        }

        public async Task DeletePinAsync(int id)
        {
            var dto = await _pinRepository.GetAsync(id);

            if (dto != null)
            {
                await _pinRepository.DeleteAsync(dto);
            }
        }

        #endregion
    }
}
