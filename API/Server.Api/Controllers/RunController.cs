using Microsoft.AspNetCore.Mvc;
using Server.Application.Contracts;
using Server.Application.Models.Output.Run;
using Server.Common.Filters;
using Server.Common.Models;
using System.Threading.Tasks;

namespace Server.Api.Controllers
{
    [ApiController]
    [Route("run")]
    public class RunController : ControllerBase
    {
        private readonly IRunService _runService;

        public RunController(IRunService runService)
        {
            _runService = runService;
        }

        [HttpGet("flows/{id}")]
        public async Task<RunFlowOutputModel> GetFlowAsync([FromRoute] int id)
        {
            return await _runService.GetFlowAsync(id);
        }

        [HttpGet("flows")]
        public async Task<PagedModel<RunFlowListItemOutputModel>> GetFlowsAsync([FromQuery] FilterOptions options)
        {
            return await _runService.GetFlowsAsync(options);
        }

        [HttpGet("nodes/{id}")]
        public async Task<RunNodeOutputModel> GetNodeAsync([FromRoute] int id)
        {
            return await _runService.GetNodeAsync(id);
        }

        [HttpGet("nodes")]
        public async Task<PagedModel<RunNodeListItemOutputModel>> GetNodesAsync([FromQuery] FilterOptions options)
        {
            return await _runService.GetNodesAsync(options);
        }
    }
}
