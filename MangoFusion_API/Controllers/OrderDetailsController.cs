using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using MangoFusion_API.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace MangoFusion_API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class OrderDetailsController : Controller
    {
        private readonly ApiResponse _response;
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<OrderDetailsController> _logger;

        public OrderDetailsController(ApplicationDbContext db, IWebHostEnvironment env, ILogger<OrderDetailsController> logger)
        {
            _db = db;
            _env = env;
            _logger = logger;
            _response = new ApiResponse();
        }

        [HttpPut("{orderDetailsId:int}")]
        public ActionResult<ApiResponse> UpdateOrder(int orderDetailsId, [FromBody] OrderDetailsUpdateDTO orderDetailsDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if(orderDetailsId != orderDetailsDTO.OrderDetailsId)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.ErrorMessages ??= new List<string>();
                        _response.ErrorMessages.Add("Invalid order Id.");

                        return BadRequest(_response);
                    }

                    OrderDetails? orderDetailsFromDb = _db.OrderDetails.FirstOrDefault(od => od.OrderDetailsId == orderDetailsId);

                    if (orderDetailsFromDb == null)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        _response.ErrorMessages ??= new List<string>();
                        _response.ErrorMessages.Add("Order not found.");

                        return NotFound(_response);
                    }

                    orderDetailsFromDb.Rating = orderDetailsDTO.Rating;

                    _db.SaveChanges();

                    _response.StatusCode = HttpStatusCode.NoContent;

                    return Ok(_response);
                }
                else
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    
                    return BadRequest(_response);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating the order.");

                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages ??= new List<string>();
                _response.ErrorMessages.Add("An error occurred while creating the order.");

                return StatusCode((int)HttpStatusCode.InternalServerError, _response);
            }
        }
    }
}
