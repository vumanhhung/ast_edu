using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class QuocGia
    {
		public int QuocGiaId { get; set; }
		public string TenQuocGia { get; set; }
		public string KyHieu { get; set; }
		public int? ViTriHieuThi { get; set; }
		public DateTime? NgayTao { get; set; }
		public string NguoiTao { get; set; }
		public DateTime? NgaySua { get; set; }
		public string NguoiSua { get; set; }
    }
}
