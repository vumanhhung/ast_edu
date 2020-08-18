using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class BacLuong
    {
		public int BacLuongId { get; set; }
		public string TenBacLuong { get; set; }
		public int? TienLuong { get; set; }
		public string NgayTao { get; set; }
		public string NguoiTao { get; set; }
		public string NgaySua { get; set; }
		public string NguoiSua { get; set; }
    }
}
