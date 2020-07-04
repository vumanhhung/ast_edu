using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class RoleDonVi
    {
		public int RoleDonViId { get; set; }
		public string RoleId { get; set; }
		public int DonViId { get; set; }
        public string RoleName { get; set; }
    }
}
