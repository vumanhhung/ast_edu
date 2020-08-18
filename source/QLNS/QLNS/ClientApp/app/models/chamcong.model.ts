export class ChamCong {
		public chamCongId: number;
		public chucDanhId: number;
		public donViId: number;
		public noiDung: string;
		public duongDan: string;
		public tenHinhAnh: string;
		public ngayTao: string;
		public nguoiTao: string;
    
    constructor(chamCongId?: number, chucDanhId?: number, donViId?: number, noiDung?: string, duongDan?: string, tenHinhAnh?: string, ngayTao?: string, nguoiTao?: string)
    {
				this.chamCongId = chamCongId;
				this.chucDanhId = chucDanhId;
				this.donViId = donViId;
				this.noiDung = noiDung;
				this.duongDan = duongDan;
				this.tenHinhAnh = tenHinhAnh;
				this.ngayTao = ngayTao;
				this.nguoiTao = nguoiTao;
    }
}
