namespace MangoFusion_API.Models.Dto
{
    public class LoginResponseDTO
    {
        public string? Email { get; set; }
        
        public string? Token { get; set; }

        public string? Role { get; set; }
    }
}
