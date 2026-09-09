using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models.Dto
{
    public class OrderHeaderCreateDTO
    {
        // Pick Up Details
        [Required]
        public required string PickUpName { get; set; }

        [Required]
        public required string PickUpPhoneNumber { get; set; }

        [Required]
        public required string PickUpEmail { get; set; }

        // Order Details
        public double OrderTotal { get; set; }

        public int TotalItems { get; set; }

        // Application User Relationship
        public string? ApplicationUserId { get; set; }

        // Order Details Relationship
        public List<OrderDetailsCreateDTO>? OrderDetailsDTO { get; set; } = new();
    }
}
