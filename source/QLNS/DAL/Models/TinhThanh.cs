using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class TinhThanh
    {
		public int TinhThanhId { get; set; }
		public string TenTinhThanh { get; set; }
		public string KyHieu { get; set; }
		public int? ViTri { get; set; }
		public string DienGiai { get; set; }
		public string NgonNgu { get; set; }
		public bool? TrangThai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
