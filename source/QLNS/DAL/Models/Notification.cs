using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string header { get; set; }
        public string body { get; set; }
        public Boolean isRead { get; set; }
        public Boolean isPinned { get; set; }
        public DateTime date { get; set; }
    }
}
