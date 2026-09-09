using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models
{
    public class OrderHeader
    {
        // Primary Key
        [Key]
        public int OrderHeaderId { get; set; }

        // Pick Up Details
        [Required]
        public required string PickUpName { get; set; }

        [Required]
        public required string PickUpPhoneNumber { get; set; }

        [Required]
        public required string PickUpEmail { get; set; }

        // Order Details
        public DateTime OrderDate { get; set; }

        public double OrderTotal { get; set; }

        public string? OrderStatus { get; set; }

        public int TotalItems { get; set; }

        // Application User Relationship
        public string? ApplicationUserId { get; set; }

        [ForeignKey("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        // Order Details Relationship
        public List<OrderDetails>? OrderDetails { get; set; } = new();

    }
}
