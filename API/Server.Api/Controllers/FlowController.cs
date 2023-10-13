using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Input.Flow;
using Server.Application.Models.Output.Flow;
using Server.Common.Filters;
using Server.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [ApiController]
    [Route("flows")]
    public class FlowController : ControllerBase
    {
        private readonly IFlowService _flowService;

        public FlowController(IFlowService flowService)
        {
            _flowService = flowService;
        }

        [HttpGet("{id}")]
        public async Task<FlowOutputModel> GetFlowAsync([FromRoute] int id)
        {
            return await _flowService.GetFlowAsync(id);
        }

        [HttpGet("template")]
        public async Task<FlowOutputModel> GetFlowTemplateAsync()
        {
            return await _flowService.GetFlowTemplateAsync();
        }

        [HttpGet]
        public async Task<PagedModel<FlowListItemOutputModel>> GetFlowsAsync([FromQuery] FilterOptions options)
        {
            return await _flowService.GetFlowsAsync(options);
        }

        [HttpPost]
        public async Task<int> CreateFlowAsync([FromBody] FlowInputModel model)
        {
            var res = await _flowService.CreateFlowAsync(model);

            return res;
        }

        [HttpPut]
        public async Task UpdateFlowAsync([FromBody] FlowInputModel model)
        {
            await _flowService.UpdateFlowAsync(model);
        }

        [HttpDelete("{id}")]
        public async Task DeleteFlowAsync([FromRoute] int id)
        {
            await _flowService.DeleteFlowAsync(id);
        }

        [HttpGet("nodes/{id}")]
        public async Task<FlowNodeOutputModel> GetNodeAsync([FromRoute] int id)
        {
            return await _flowService.GetNodeAsync(id);
        }

        [HttpGet("platforms/list")]
        public async Task<IEnumerable<FlowPlatformListItemOutputModel>> GetPlatformsListAsync([FromQuery] string filter = "", [FromQuery] bool includeNodes = true)
        {
            return await _flowService.GetPlatformsListAsync(filter ?? string.Empty, includeNodes);
        }

        [HttpGet("flowsAsTasks")]
        public async Task<IEnumerable<FlowsAsTasksListItemOutputModel>> GetFlowsListAsync([FromQuery] string filter = "")
        {
            return await _flowService.GetFlowsListAsync(filter ?? string.Empty);
        }
    }
}
