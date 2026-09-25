using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using MangoFusion_API.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace MangoFusion_API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class OrderHeadersController : Controller
    {
        private readonly ApiResponse _response;
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<OrderHeadersController> _logger;

        public OrderHeadersController(ApplicationDbContext db, IWebHostEnvironment env, ILogger<OrderHeadersController> logger)
        {
            _db = db;
            _env = env;
            _logger = logger;
            _response = new ApiResponse();
        }

        [HttpGet]
        public IActionResult GetOrders(string userId = "")
        {
            IEnumerable<OrderHeader> orderHeaderList = _db.OrderHeaders
                .Include(o => o.OrderDetails!)
                .ThenInclude(m => m.MenuItem)
                .OrderByDescending(o => o.OrderHeaderId);

            if (!string.IsNullOrEmpty(userId))
            {
                orderHeaderList = orderHeaderList.Where(o => o.ApplicationUserId == userId);
            }

            _response.Result = orderHeaderList;
            _response.StatusCode = HttpStatusCode.OK;

            return Ok(_response);
        }

        [HttpGet("{orderId:int}")]
        public IActionResult GetOrder(int orderId)
        {
            if (orderId == 0)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.ErrorMessages ??= new List<string>();
                _response.ErrorMessages.Add("Invalid order ID.");

                return BadRequest(_response);
            }

            OrderHeader? orderHeader = _db.OrderHeaders
                 .Include(o => o.OrderDetails!)
                 .ThenInclude(m => m.MenuItem)
                 .FirstOrDefault(o => o.OrderHeaderId == orderId);

            if (orderHeader == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages ??= new List<string>();
                _response.ErrorMessages.Add("Order not found.");

                return NotFound(_response);
            }

            _response.Result = orderHeader;
            _response.StatusCode = HttpStatusCode.OK;

            return Ok(_response);
        }

        [HttpPost]
        public ActionResult<ApiResponse> CreateOrder([FromBody] OrderHeaderCreateDTO orderHeaderDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    OrderHeader orderHeader = new OrderHeader
                    {
                        ApplicationUserId = orderHeaderDTO.ApplicationUserId,
                        OrderDate = DateTime.Now,
                        OrderTotal = orderHeaderDTO.OrderTotal,
                        PickUpName = orderHeaderDTO.PickUpName,
                        PickUpPhoneNumber = orderHeaderDTO.PickUpPhoneNumber,
                        PickUpEmail = orderHeaderDTO.PickUpEmail,
                        OrderStatus = SD.status_confirmed,
                        TotalItems = orderHeaderDTO.TotalItems,
                    };

                    _db.OrderHeaders.Add(orderHeader);
                    _db.SaveChanges();

                    foreach (var orderDetailsDTO in orderHeaderDTO.OrderDetailsDTO!)
                    {
                        OrderDetails orderDetails = new()
                        {
                            OrderHeaderId = orderHeader.OrderHeaderId,
                            MenuItemId = orderDetailsDTO.MenuItemId,
                            Quantity = orderDetailsDTO.Quantity,
                            ItemName = orderDetailsDTO.ItemName,
                            Price = orderDetailsDTO.Price
                        };

                        _db.OrderDetails.Add(orderDetails);
                    }

                    _db.SaveChanges();

                    _response.Result = orderHeader;
                    orderHeader.OrderDetails = [];
                    _response.StatusCode = HttpStatusCode.Created;

                    return CreatedAtAction(nameof(GetOrder), new { orderId = orderHeader.OrderHeaderId }, _response);
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

        [HttpPut("{orderId:int}")]
        public ActionResult<ApiResponse> UpdateOrder(int orderId, [FromBody] OrderHeaderUpdateDTO orderHeaderDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if(orderId != orderHeaderDTO.OrderHeaderId)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.ErrorMessages ??= new List<string>();
                        _response.ErrorMessages.Add("Invalid order Id.");

                        return BadRequest(_response);
                    }

                    OrderHeader? orderHeaderFromDb = _db.OrderHeaders.FirstOrDefault(oh => oh.OrderHeaderId == orderId);

                    if (orderHeaderFromDb == null)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        _response.ErrorMessages ??= new List<string>();
                        _response.ErrorMessages.Add("Order not found.");

                        return NotFound(_response);
                    }

                    if(!string.IsNullOrEmpty(orderHeaderDTO.PickUpName))
                    {
                        orderHeaderFromDb.PickUpName = orderHeaderDTO.PickUpName;
                    }

                    if (!string.IsNullOrEmpty(orderHeaderDTO.PickUpEmail))
                    {
                        orderHeaderFromDb.PickUpEmail = orderHeaderDTO.PickUpEmail;
                    }

                    if (!string.IsNullOrEmpty(orderHeaderDTO.PickUpPhoneNumber))
                    {
                        orderHeaderFromDb.PickUpPhoneNumber = orderHeaderDTO.PickUpPhoneNumber;
                    }

                    if (!string.IsNullOrEmpty(orderHeaderDTO.OrderStatus))
                    {
                        if(string.Equals(orderHeaderFromDb.OrderStatus, SD.status_confirmed, StringComparison.InvariantCultureIgnoreCase) &&
                           string.Equals(orderHeaderDTO.OrderStatus, SD.status_readyForPickup, StringComparison.InvariantCultureIgnoreCase))
                        {
                            orderHeaderFromDb.OrderStatus = SD.status_readyForPickup;
                        }

                        if(string.Equals(orderHeaderFromDb.OrderStatus, SD.status_readyForPickup, StringComparison.InvariantCultureIgnoreCase) &&
                           string.Equals(orderHeaderDTO.OrderStatus, SD.status_completed, StringComparison.InvariantCultureIgnoreCase))
                        {
                            orderHeaderFromDb.OrderStatus = SD.status_completed;
                        }

                        if(string.Equals(orderHeaderDTO.OrderStatus, SD.status_canceled, StringComparison.InvariantCultureIgnoreCase))
                        {
                            orderHeaderFromDb.OrderStatus = SD.status_canceled;
                        }
                    }

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
    