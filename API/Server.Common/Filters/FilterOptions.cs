using System.ComponentModel.DataAnnotations;

namespace Server.Common.Filters
{
    public class FilterOptions
    {
        public string Filter { get; set; }
        [Required]
        public int Skip { get; set; }
        [Required]
        public int Take { get; set; }
    }
}
