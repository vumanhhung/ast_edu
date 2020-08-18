using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class ChamCong
    {
		public int ChamCongId { get; set; }
		public int? ChucDanhId { get; set; }
		public int? DonViId { get; set; }
		public string NoiDung { get; set; }
		public string DuongDan { get; set; }
		public string TenHinhAnh { get; set; }
		public string NgayTao { get; set; }
		public string NguoiTao { get; set; }
    }
}
