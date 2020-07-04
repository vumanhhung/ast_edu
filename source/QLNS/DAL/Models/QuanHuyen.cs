using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class QuanHuyen
    {
		public int QuanHuyenId { get; set; }
		public string MaQuanHuyen { get; set; }
		public string TenQuanHuyen { get; set; }
		public string PhanLoai { get; set; }
		public int? ViTriHienThi { get; set; }
		public int? TinhThanhId { get; set; }
		public bool? TrangThai { get; set; }
		public TinhThanh TinhThanhs { get; set; }
	}
}
