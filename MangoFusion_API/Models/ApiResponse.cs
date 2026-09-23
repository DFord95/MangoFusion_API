using System.Net;

namespace MangoFusion_API.Models
{
    public class ApiResponse
    {
        public HttpStatusCode StatusCode { get; set; }

        public bool IsSuccess { get; set; } = true;

        public List<string> ErrorMessages { get; set; } = new();

        public object? Result { get; set; }
    }
}
