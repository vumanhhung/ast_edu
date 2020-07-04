export class TinhThanh {
		public tinhThanhId: number;
		public tenTinhThanh: string;
		public kyHieu: string;
		public viTri: number;
		public dienGiai: string;
		public ngonNgu: string;
		public trangThai: boolean;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(tinhThanhId?: number, tenTinhThanh?: string, kyHieu?: string, viTri?: number, dienGiai?: string, ngonNgu?: string, trangThai?: boolean, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.tinhThanhId = tinhThanhId;
				this.tenTinhThanh = tenTinhThanh;
				this.kyHieu = kyHieu;
				this.viTri = viTri;
				this.dienGiai = dienGiai;
				this.ngonNgu = ngonNgu;
				this.trangThai = trangThai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
