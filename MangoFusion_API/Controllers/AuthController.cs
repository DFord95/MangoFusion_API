using MangoFusion_API.Data;
using MangoFusion_API.Models;
using MangoFusion_API.Models.Dto;
using MangoFusion_API.Utilities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace MangoFusion_API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly string secretKey;
        private readonly ApiResponse _response;
        private readonly ILogger<AuthController> _logger;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger<AuthController> logger, IConfiguration configuration, IWebHostEnvironment environment)
        {
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _environment = environment;
            _response = new ApiResponse();
            secretKey = configuration.GetValue<string>("ApiSettings:Secret") ?? "";
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO model)
        {
            if (ModelState.IsValid)
            {
                if (!IsMailConfigured())
                {
                    _logger.LogError("Account email is not configured.");
                    return StatusCode(StatusCodes.Status503ServiceUnavailable);
                }

                ApplicationUser newUser = new()
                {
                    FirstName = model.FirstName,
                    MiddleInit = model.MiddleInit,
                    LastName = model.LastName,
                    Suffix = model.Suffix,
                    Email = model.Email,
                    UserName = model.Email,
                    NormalizedEmail = model.Email.ToUpper(),
                };

                var result = await _userManager.CreateAsync(newUser, model.Password);

                if (result.Succeeded)
                {
                    if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult())
                    {
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                    }

                    if (model.Role.Equals(SD.Role_Admin, StringComparison.CurrentCultureIgnoreCase))
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);

                    }
                    else
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);
                    }

                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
                    var confirmationSent = await SendAccountLinkAsync(newUser.Email!, "confirm-email", token,
                        "Confirm your MangoFusion email", "Use this link to confirm your email address:");

                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                    _response.Result = new
                    {
                        newUser.Id,
                        newUser.Name,
                        newUser.Email,
                        ConfirmationSent = confirmationSent
                    };

                    return Ok(_response);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        _response.ErrorMessages.Add(error.Description);
                    }

                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;

                    return BadRequest(_response);
                }

            }
            else
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;

                foreach (var error in ModelState.Values)
                {
                    foreach (var item in error.Errors)
                    {
                        _response.ErrorMessages.Add(item.ErrorMessage);
                    }
                }

                return BadRequest(_response);
            }
        }

        [HttpPost("ConfirmEmail")]
        [EnableRateLimiting("password-reset")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequestDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            var result = user == null ? null : await _userManager.ConfirmEmailAsync(user, model.Token);
            if (result?.Succeeded != true)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid or expired confirmation link.");
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        [HttpPost("ResendConfirmation")]
        [EnableRateLimiting("password-reset")]
        public async Task<IActionResult> ResendConfirmation([FromBody] ForgotPasswordRequestDTO model)
        {
            if (!IsMailConfigured())
            {
                _logger.LogError("Account email is not configured.");
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && !await _userManager.IsEmailConfirmedAsync(user))
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await SendAccountLinkAsync(model.Email, "confirm-email", token,
                    "Confirm your MangoFusion email", "Use this link to confirm your email address:");
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = "If an unconfirmed account exists for this email, a confirmation link has been sent.";
            return Ok(_response);
        }

        [HttpPost("ForgotPassword")]
        [EnableRateLimiting("password-reset")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO model)
        {
            if (!IsMailConfigured())
            {
                _logger.LogError("Password reset email is not configured.");
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                await SendAccountLinkAsync(model.Email, "reset-password", token,
                    "Reset your MangoFusion password", "Use this link to reset your password:");
            }

            _response.StatusCode = HttpStatusCode.OK;
            _response.Result = "If an account exists for this email, a reset link has been sent.";
            return Ok(_response);
        }

        [HttpPost("ResetPassword")]
        [EnableRateLimiting("password-reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Invalid or expired reset link.");
                return BadRequest(_response);
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (!result.Succeeded)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.AddRange(result.Errors.Select(error => error.Code == "InvalidToken" ? "Invalid or expired reset link." : error.Description));
                return BadRequest(_response);
            }

            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        private bool IsMailConfigured()
        {
            var clientUrl = _configuration["PasswordReset:ClientUrl"]
                ?? (_environment.IsDevelopment() ? "http://localhost:5173" : null);
            var username = _configuration["Smtp:Username"];
            var useTls = _configuration.GetValue<bool?>("Smtp:EnableSsl") ?? true;

            return !string.IsNullOrWhiteSpace(_configuration["Smtp:Host"]) &&
                !string.IsNullOrWhiteSpace(_configuration["Smtp:From"]) &&
                (string.IsNullOrWhiteSpace(username) || (useTls && !string.IsNullOrWhiteSpace(_configuration["Smtp:Password"]))) &&
                Uri.TryCreate(clientUrl, UriKind.Absolute, out var frontendUri) &&
                (frontendUri.Scheme == Uri.UriSchemeHttps || (_environment.IsDevelopment() && frontendUri.Scheme == Uri.UriSchemeHttp));
        }

        private async Task<bool> SendAccountLinkAsync(string email, string path, string token, string subject, string introduction)
        {
            var clientUrl = _configuration["PasswordReset:ClientUrl"]
                ?? (_environment.IsDevelopment() ? "http://localhost:5173" : null);
            var url = QueryHelpers.AddQueryString(
                $"{clientUrl!.TrimEnd('/')}/{path}",
                new Dictionary<string, string?> { ["email"] = email, ["token"] = token });

            try
            {
                using var message = new MailMessage(_configuration["Smtp:From"]!, email)
                {
                    Subject = subject,
                    Body = $"{introduction} {url}\n\nIf you did not request this, you can ignore this email."
                };
                using var smtp = new SmtpClient(_configuration["Smtp:Host"]!, _configuration.GetValue<int?>("Smtp:Port") ?? 587)
                {
                    EnableSsl = _configuration.GetValue<bool?>("Smtp:EnableSsl") ?? true
                };
                if (!string.IsNullOrWhiteSpace(_configuration["Smtp:Username"]))
                {
                    smtp.Credentials = new NetworkCredential(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);
                }
                await smtp.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send an account email.");
                return false;
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
        {
            if (ModelState.IsValid)
            {
                var userFromDb = await _userManager.FindByEmailAsync(model.Email);

                if (userFromDb != null)
                {
                    bool isValid = await _userManager.CheckPasswordAsync(userFromDb, model.Password);

                    if (!isValid)
                    {
                        _response.Result = new LoginRequestDTO();
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        _response.ErrorMessages?.Add("Invalid login attempt.");

                        return BadRequest(_response);
                    }

                    JwtSecurityTokenHandler tokenHandler = new();
                    byte[] key = Encoding.ASCII.GetBytes(secretKey);

                    SecurityTokenDescriptor tokenDescriptor = new()
                    {
                        Subject = new ClaimsIdentity(
                            [
                                new ("fullName", userFromDb.Name),
                                new ("id", userFromDb.Id),
                                new (ClaimTypes.Email, userFromDb.Email!.ToString()),
                                new (ClaimTypes.Role, _userManager.GetRolesAsync(userFromDb).Result.FirstOrDefault() ?? "")
                            ]),

                        Expires = DateTime.UtcNow.AddDays(7),
                        SigningCredentials = new (new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                    };

                    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

                    LoginResponseDTO loginResponse = new()
                    {
                        Email = userFromDb.Email,
                        Token = tokenHandler.WriteToken(token),
                        Role = _userManager.GetRolesAsync(userFromDb).Result.FirstOrDefault()
                    };

                    _response.Result = loginResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;

                    return Ok(_response);
                }

                _response.Result = new LoginRequestDTO();
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages?.Add("Invalid login attempt.");

                return BadRequest(_response);
            }
            else
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;

                foreach (var error in ModelState.Values)
                {
                    foreach (var item in error.Errors)
                    {
                        _response.ErrorMessages?.Add(item.ErrorMessage);
                    }
                }

                return BadRequest(_response);
            }
        }
    }
}

