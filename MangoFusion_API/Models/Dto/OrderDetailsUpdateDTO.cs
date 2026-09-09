using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models.Dto
{
    public class OrderDetailsUpdateDTO
    {
        // OrderDetails 
        [Required]
        public int OrderDetailsId { get; set; }

        [Required, Range(1, 5)]
        public int Rating { get; set; }
    }
}
