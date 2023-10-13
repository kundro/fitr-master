using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Input.Platform;
using Server.Application.Models.Output.Platform;
using Server.Common.Filters;
using Server.Common.Models;
using System;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{

    [ApiController]
    [Route("platforms")]
    public class PlatformController : ControllerBase
    {
        private readonly IPlatformService _platformService;

        public PlatformController(IPlatformService platformService)
        {
            _platformService = platformService;
        }

        #region Platform

        [HttpGet("{id}")]
        public async Task<PlatformOutputModel> GetPlatformAsync([FromRoute] int id)
        {
            return await _platformService.GetPlatformAsync(id);
        }

        [HttpGet]
        public async Task<PagedModel<PlatformListItemOutputModel>> GetPlatformsAsync([FromQuery] FilterOptions options)
        {
            return await _platformService.GetPlatformsAsync(options);
        }

        [HttpPost]
        public async Task<int> CreatePlatformAsync([FromBody] PlatformInputModel model)
        {
            return await _platformService.CreatePlatformAsync(model);
        }

        [HttpPut]
        public async Task UpdatePlatformAsync([FromBody] PlatformInputModel model)
        {
            await _platformService.UpdatePlatformAsync(model);
        }

        [HttpDelete("{id}")]
        public async Task DeletePlatformAsync([FromRoute] int id)
        {
            await _platformService.DeletePlatformAsync(id);
        }

        #endregion

        #region Node

        [HttpGet("nodes/{id}")]
        public async Task<PlatformNodeOutputModel> GetNodeAsync(int id)
        {
            return await _platformService.GetNodeAsync(id);
        }

        [HttpGet("{platformId}/nodes")]
        public async Task<PagedModel<PlatformNodeListItemOutputModel>> GetNodesAsync(int platformId, [FromQuery] FilterOptions options)
        {
            return await _platformService.GetNodesAsync(platformId, options);
        }

        [HttpPost("nodes")]
        public async Task<int> CreateNodeAsync([FromBody] PlatformNodeInputModel model)
        {
            return await _platformService.CreateNodeAsync(model);
        }

        [HttpPut("nodes")]
        public async Task UpdateNodeAsync([FromBody] PlatformNodeInputModel model)
        {
            await _platformService.UpdateNodeAsync(model);
        }

        [HttpDelete("nodes/{id}")]
        public async Task DeleteNodeAsync([FromRoute] int id)
        {
            await _platformService.DeleteNodeAsync(id);
        }

        #endregion

        #region Pin

        [HttpGet("nodes/pins/{id}")]
        public async Task<PlatformNodePinOutputModel> GetPinAsync(int id)
        {
            return await _platformService.GetPinAsync(id);
        }

        [HttpGet("nodes/{nodeId}/pins")]
        public async Task<PagedModel<PlatformNodePinListItemOutputModel>> GetPinsAsync(int nodeId, [FromQuery] FilterOptions options)
        {
            return await _platformService.GetPinsAsync(nodeId, options);
        }

        [HttpPost("nodes/pins")]
        public async Task<int> CreatePinAsync([FromBody] PlatformNodePinInputModel model)
        {
            return await _platformService.CreatePinAsync(model);
        }

        [HttpPut("nodes/pins")]
        public async Task UpdatePinAsync([FromBody] PlatformNodePinInputModel model)
        {
            await _platformService.UpdatePinAsync(model);
        }

        [HttpDelete("nodes/pins/{id}")]
        public async Task DeletePinAsync([FromRoute] int id)
        {
            await _platformService.DeletePinAsync(id);
        }

        #endregion
    }
}
