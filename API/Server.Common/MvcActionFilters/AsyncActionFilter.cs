using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Server.Common.Models;
using Server.Common.Services;
using System;
using System.Threading.Tasks;

namespace Server.Common.MvcActionFilters
{
    public class AsyncActionFilter : IAsyncActionFilter
    {
        private readonly ErrorCollector _errorCollector;

        public AsyncActionFilter(ErrorCollector errorCollector)
        {
            _errorCollector = errorCollector;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

#if !DEBUG
            if (resultContext.Exception != null)
            {
                string message = resultContext.Exception.Message;

                _errorCollector.AddError(message, resultContext.Exception.GetType().Name, resultContext.Exception.InnerException?.Message);
                resultContext.ExceptionHandled = true;
            }
#endif

            if (resultContext != null && resultContext.Result is ObjectResult res)
            {
                res.Value = _errorCollector.GetResult(res?.Value);
            }
            else
            {
                resultContext.Result = new OkObjectResult(_errorCollector.GetResult());
            }
        }
    }
}
