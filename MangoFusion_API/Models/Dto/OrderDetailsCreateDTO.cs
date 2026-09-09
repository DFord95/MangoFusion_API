using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models.Dto
{
    public class OrderDetailsCreateDTO
    {
        // Menu Item Relationship
        [Required]
        public int MenuItemId { get; set; }

        // Item details
        [Required]
        public required string ItemName { get; set; }

        [Required]
        public double Price { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
