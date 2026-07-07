using System.ComponentModel.DataAnnotations;

namespace MangoFusion_API.Models
{
    public class MenuItem
    {
        // Primary Key
        [Key]
        public int Id { get; set; }

        // Basic Information
        [Required]
        public required string Name { get; set; }

        public string? Description { get; set; }

        // Classification
        public string? Category { get; set; }

        public string? SpecialTag { get; set; }

        // Pricing
        [Range(1, 10000)]
        public double Price { get; set; }

        // Media
        [Required]
        public string Image { get; set; } = string.Empty;
    }
}
