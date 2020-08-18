using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class DoiTac
    {
		public int DoiTacId { get; set; }
		public string TenDoiTac { get; set; }
		public string MaDoiTac { get; set; }
		public string AnhDaiDien { get; set; }
		public string NguoiTao { get; set; }
		public string NgayTao { get; set; }
		public string NguoiSua { get; set; }
		public string NgaySua { get; set; }
    }
}
