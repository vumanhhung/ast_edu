export class GioiTinh {
		public gioiTinhId: number;
		public tenGioiTinh: string;
		public kyHieu: string;
		public ghiChu: string;
		public thuTuHienThi: number;
		public trangThai: number;
		public ngayTao: Date;
		public nguoiTao: string;
		public ngaySua: Date;
		public nguoiSua: string;
    
    constructor(gioiTinhId?: number, tenGioiTinh?: string, kyHieu?: string, ghiChu?: string, thuTuHienThi?: number, trangThai?: number, ngayTao?: Date, nguoiTao?: string, ngaySua?: Date, nguoiSua?: string)
    {
				this.gioiTinhId = gioiTinhId;
				this.tenGioiTinh = tenGioiTinh;
				this.kyHieu = kyHieu;
				this.ghiChu = ghiChu;
				this.thuTuHienThi = thuTuHienThi;
				this.trangThai = trangThai;
				this.ngayTao = ngayTao;
				this.nguoiTao = nguoiTao;
				this.ngaySua = ngaySua;
				this.nguoiSua = nguoiSua;
    }
}
