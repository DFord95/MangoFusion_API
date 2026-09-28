using System.ComponentModel.DataAnnotations;

namespace MangoFusion_API.Models.Dto
{
    public class ConfirmEmailRequestDTO
    {
        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Token { get; set; }
    }
}