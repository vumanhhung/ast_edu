using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class GioiTinh
    {
		public int GioiTinhId { get; set; }
		public string TenGioiTinh { get; set; }
		public string KyHieu { get; set; }
		public string GhiChu { get; set; }
		public int? ThuTuHienThi { get; set; }
		public int? TrangThai { get; set; }
		public DateTime? NgayTao { get; set; }
		public string NguoiTao { get; set; }
		public DateTime? NgaySua { get; set; }
		public string NguoiSua { get; set; }
    }
}
