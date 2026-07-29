using MangoFusion_API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MangoFusion_API.Controllers
{
    [ApiController, Route("api/AuthTest")]
    public class AuthTestController : Controller
    {
        [HttpGet, Authorize]
        public ActionResult<string> GetAuthUsers()
        {
            return "You are an authorized user.";
        }

        [HttpGet("{authUser:int}"), Authorize(Roles = SD.Role_Admin)]
        public ActionResult<string> GetAuthUser(int authUser)
        {
            return "You are an authorized Admin.";
        }
    }
}
