using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models
{   
    public class Log
    {
		public long LogID { get; set; }
		public string TenModule { get; set; }
		public string HanhDong { get; set; }
		public string NoiDung { get; set; }
		public string NguoiThucHien { get; set; }
		public DateTime? NgayThucHien { get; set; }
        public string NgayThucHienString
        {
            get
            {
                try
                {
                    string date = Convert.ToDateTime(NgayThucHien).ToString("dd/MM/yyyy HH:mm");
                    return date;
                }
                catch (Exception)
                {
                    return "";
                }
            }
        }
    }
}
