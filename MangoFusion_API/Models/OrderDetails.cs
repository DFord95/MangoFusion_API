using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models
{
    public class OrderDetails
    {
        // Identity
        [Key]
        public int OrderDetailsId { get; set; }

        // Relationships
        [Required]
        public required int OrderHeaderId { get; set; }

        [Required]
        public int MenuItemId { get; set; }

        [ForeignKey("MenuItemId")]
        public MenuItem? MenuItem { get; set; }

        // Item details
        [Required]
        public required string ItemName { get; set; }

        [Required]
        public double Price { get; set; }

        [Required]
        public int Quantity { get; set; }

        // Optional rating for the menu item
        public int? Rating { get; set; } = null;
    }
}
