using System;

namespace Server.Common.Dtos
{
    public class HistoricalEntity : Entity
    {
        public string AddSource { get; set; }
        public DateTime? AddDate { get; set; }
        public string ChangeSource { get; set; }
        public DateTime? ChangeDate { get; set; }
    }
}
