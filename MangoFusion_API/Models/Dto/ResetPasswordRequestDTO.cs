using System.ComponentModel.DataAnnotations;

namespace MangoFusion_API.Models.Dto
{
    public class ResetPasswordRequestDTO
    {
        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Token { get; set; }

        [Required]
        public required string NewPassword { get; set; }

        [Required, Compare(nameof(NewPassword))]
        public required string ConfirmPassword { get; set; }
    }
}