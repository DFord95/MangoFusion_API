using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace MangoFusion_API.Controllers
{
    [ApiController, Route("api/MenuItem")]
    public class MenuItemsController : Controller
    {
        private readonly ApiResponse _response;
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<MenuItemsController> _logger;

        public MenuItemsController(ApplicationDbContext db, IWebHostEnvironment env, ILogger<MenuItemsController> logger)
        {
            _db = db;
            _env = env;
            _logger = logger;
            _response = new ApiResponse();
        }

        [HttpGet]
        public IActionResult GetMenuItems()
        {
            List<MenuItem> menuItems = _db.MenuItems.ToList();

            List<OrderDetails> orderDetailsWithRatings = _db.OrderDetails.Where(od => od.Rating != null).ToList();

            foreach (var menuItem in menuItems)
            {
                var rating = orderDetailsWithRatings
                    .Where(od => od.MenuItemId == menuItem.Id)
                    .Select(od => od.Rating)
                    .Where(r => r.HasValue)
                    .Select(r => r.GetValueOrDefault())
                    .ToList();

                double averageRating = rating.Any() ? rating.Average() : 0;

                menuItem.Rating = averageRating;
            }

            _response.Result = menuItems;
            _response.StatusCode = HttpStatusCode.OK;

            return Ok(_response);
        }

        [HttpGet("{id:int}", Name = "GetMenuItem")]
        public IActionResult GetMenuItem(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;

                return BadRequest(_response);
            }

            MenuItem? menuItem = _db.MenuItems.FirstOrDefault(mi => mi.Id == id);

            if (menuItem == null)
            {
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.ErrorMessages = ["Menu item not found."];

                return NotFound(_response);
            }

            List<OrderDetails> orderDetailsWithRatings = _db.OrderDetails.Where(od => od.Rating != null && od.MenuItemId == menuItem.Id).ToList();

            var rating = orderDetailsWithRatings
                .Select(od => od.Rating)
                .Where(r => r.HasValue)
                .Select(r => r.GetValueOrDefault())
                .ToList();

            double averageRating = rating.Any() ? rating.Average() : 0;

            menuItem.Rating = averageRating;

            _response.Result = menuItem;
            _response.StatusCode = HttpStatusCode.OK;

            return Ok(_response);
        }

        [HttpPost, Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse>> CreateMenuItem([FromForm] MenuItemCreateDTO menuItemCreateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemCreateDTO.Image == null || menuItemCreateDTO.Image.Length == 0)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.ErrorMessages = ["Image is required!"];

                        return BadRequest(_response);
                    }

                    var imagePath = Path.Combine(_env.WebRootPath, "images");

                    if (!Directory.Exists(imagePath))
                    {
                        Directory.CreateDirectory(imagePath);
                    }

                    var filePath = Path.Combine(imagePath, menuItemCreateDTO.Image.FileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    //Image Upload
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await menuItemCreateDTO.Image.CopyToAsync(stream);
                    }

                    MenuItem menuItem = new()
                    {
                        Name = menuItemCreateDTO.Name,
                        Description = menuItemCreateDTO.Description,
                        Price = menuItemCreateDTO.Price,
                        Category = menuItemCreateDTO.Category,
                        SpecialTag = menuItemCreateDTO.SpecialTag,
                        Image = "images/" + menuItemCreateDTO.Image.FileName
                    };

                    _db.MenuItems.Add(menuItem);
                    await _db.SaveChangesAsync();

                    _response.Result = menuItemCreateDTO;
                    _response.StatusCode = HttpStatusCode.Created;

                    return CreatedAtRoute("GetMenuItem", new { id = menuItem.Id }, _response);
                }
                else
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = [ex.ToString()];
            }

            return BadRequest(_response);
        }

        [HttpPut("{id}"), Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse>> UpdateMenuItem(int id, [FromForm] MenuItemUpdateDTO menuItemUpdateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemUpdateDTO == null || menuItemUpdateDTO.Id != id)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.ErrorMessages = ["Invalid menu item Id."];

                        return BadRequest(_response);
                    }

                    MenuItem? menuItemFromDb = await _db.MenuItems.FirstOrDefaultAsync(mi => mi.Id == id);

                    if (menuItemFromDb == null)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        _response.ErrorMessages = ["Menu item not found."];

                        return NotFound(_response);
                    }

                    menuItemFromDb.Name = menuItemUpdateDTO.Name;
                    menuItemFromDb.Description = menuItemUpdateDTO.Description;
                    menuItemFromDb.Price = menuItemUpdateDTO.Price;
                    menuItemFromDb.Category = menuItemUpdateDTO.Category;
                    menuItemFromDb.SpecialTag = menuItemUpdateDTO.SpecialTag;

                    if (menuItemUpdateDTO.Image != null && menuItemUpdateDTO.Image.Length > 0)
                    {
                        var imagePath = Path.Combine(_env.WebRootPath, "images");

                        if (!Directory.Exists(imagePath))
                        {
                            Directory.CreateDirectory(imagePath);
                        }

                        var filePath = Path.Combine(imagePath, menuItemUpdateDTO.Image.FileName);

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }

                        var filePath_previousImage = Path.Combine(_env.WebRootPath, menuItemFromDb.Image);

                        if (System.IO.File.Exists(filePath_previousImage))
                        {
                            System.IO.File.Delete(filePath_previousImage);
                        }

                        //Image Upload
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await menuItemUpdateDTO.Image.CopyToAsync(stream);
                        }

                        menuItemFromDb.Image = "images/" + menuItemUpdateDTO.Image.FileName;
                    }

                    _db.MenuItems.Update(menuItemFromDb);
                    await _db.SaveChangesAsync();

                    _response.StatusCode = HttpStatusCode.NoContent;

                    return Ok(_response);
                }
                else
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = [ex.ToString()];
            }

            return BadRequest(_response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse>> DeleteMenuItem(int id)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (id == 0)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.ErrorMessages = ["Invalid menu item."];

                        return BadRequest(_response);
                    }

                    MenuItem? menuItemFromDb = await _db.MenuItems.FirstOrDefaultAsync(mi => mi.Id == id);

                    if (menuItemFromDb == null)
                    {
                        _response.IsSuccess = false;
                        _response.StatusCode = HttpStatusCode.NotFound;
                        _response.ErrorMessages = ["Menu item not found."];

                        return NotFound(_response);
                    }

                    var filePath_existingImage = Path.Combine(_env.WebRootPath, menuItemFromDb.Image);

                    if (System.IO.File.Exists(filePath_existingImage))
                    {
                        System.IO.File.Delete(filePath_existingImage);
                    }

                    _db.MenuItems.Remove(menuItemFromDb);
                    await _db.SaveChangesAsync();

                    _response.StatusCode = HttpStatusCode.NoContent;

                    return Ok(_response);
                }
                else
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages = [ex.ToString()];
            }

            return BadRequest(_response);
        }
    }
}
