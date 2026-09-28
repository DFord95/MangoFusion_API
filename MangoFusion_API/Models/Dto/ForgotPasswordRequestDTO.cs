using System.ComponentModel.DataAnnotations;

namespace MangoFusion_API.Models.Dto
{
    public class ForgotPasswordRequestDTO
    {
        [Required, EmailAddress]
        public required string Email { get; set; }
    }
}