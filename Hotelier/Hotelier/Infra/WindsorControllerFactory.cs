using System;
using Castle.MicroKernel;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.SessionState;

namespace Hotelier
{
    public class WindsorControllerFactory : IControllerFactory
    {
        private readonly IKernel _kernel;

        public WindsorControllerFactory(IKernel kernel)
        {
            _kernel = kernel;
        }

        public IController CreateController(RequestContext requestContext, string controllerName)
        {
            return _kernel.Resolve<IController>(controllerName.ToLowerInvariant() + "controller");
        }

  	    public SessionStateBehavior GetControllerSessionBehavior(RequestContext requestContext, string controllerName)
  	    {
  	        return SessionStateBehavior.Disabled;
  	    }

        public void ReleaseController(IController controller)
        {
            _kernel.ReleaseComponent(controller);
        }
    }
}

