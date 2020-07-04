using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class ChucDanh
    {
		public int ChucDanhId { get; set; }
		public string TenChucDanh { get; set; }
		public string KyHieu { get; set; }
		public string DienGiai { get; set; }
		public int? PhanLoaiChucDanh { get; set; }
		public string NgonNgu { get; set; }
		public int? ViTri { get; set; }
		public bool? TrangThai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
