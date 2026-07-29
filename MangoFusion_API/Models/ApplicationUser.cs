using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace MangoFusion_API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }

        public string? MiddleInit { get; set; }

        public string? LastName { get; set; }

        public string? Suffix { get; set; }

        // Computed property to get the full name of the user
        [NotMapped]
        public string Name =>
        string.Join(" ",
            new[] { FirstName, MiddleInit, LastName, Suffix }
            .Where(s => !string.IsNullOrWhiteSpace(s)));

    }
}
