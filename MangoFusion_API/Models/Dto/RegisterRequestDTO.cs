using System.ComponentModel.DataAnnotations;

namespace MangoFusion_API.Models.Dto
{
    public class RegisterRequestDTO
    {
        // User Information
        [Required]
        public required string FirstName { get; set; }

        public string? MiddleInit { get; set; }

        [Required]
        public required string LastName { get; set; }

        public string? Suffix { get; set; }

        // User Credentials
        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        // User Role
        public string? Role { get; set; }
    }
}
