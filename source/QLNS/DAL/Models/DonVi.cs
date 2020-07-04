using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class DonVi
    {
		public int DonViId { get; set; }
		public string TenDonVi { get; set; }
		public int? MaDonViCha { get; set; }
		public string KyHieu { get; set; }
		public int? SubLv { get; set; }
		public string NgonNgu { get; set; }
		public int? ViTri { get; set; }
		public string DienGiai { get; set; }
		public bool? TrangThai { get; set; }
		public string NguoiNhap { get; set; }
		public DateTime? NgayNhap { get; set; }
		public string NguoiSua { get; set; }
		public DateTime? NgaySua { get; set; }
    }
}
