using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models.Dto
{
    public class OrderHeaderUpdateDTO
    {
        // Primary Key
        [Required]
        public int OrderHeaderId { get; set; }

        // Pick Up Details
        public required string PickUpName { get; set; } = string.Empty;

        public required string PickUpPhoneNumber { get; set; } = string.Empty;

        public required string PickUpEmail { get; set; } = string.Empty;

        // Order Details
        public string? OrderStatus { get; set; } = string.Empty;
    }
}
