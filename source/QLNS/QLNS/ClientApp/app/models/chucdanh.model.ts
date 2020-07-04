export class ChucDanh {
		public chucDanhId: number;
		public tenChucDanh: string;
		public kyHieu: string;
		public dienGiai: string;
		public phanLoaiChucDanh: number;
		public ngonNgu: string;
		public viTri: number;
		public trangThai: boolean;
		public nguoiNhap: string;
		public ngayNhap: Date;
		public nguoiSua: string;
		public ngaySua: Date;
    
    constructor(chucDanhId?: number, tenChucDanh?: string, kyHieu?: string, dienGiai?: string, phanLoaiChucDanh?: number, ngonNgu?: string, viTri?: number, trangThai?: boolean, nguoiNhap?: string, ngayNhap?: Date, nguoiSua?: string, ngaySua?: Date)
    {
				this.chucDanhId = chucDanhId;
				this.tenChucDanh = tenChucDanh;
				this.kyHieu = kyHieu;
				this.dienGiai = dienGiai;
				this.phanLoaiChucDanh = phanLoaiChucDanh;
				this.ngonNgu = ngonNgu;
				this.viTri = viTri;
				this.trangThai = trangThai;
				this.nguoiNhap = nguoiNhap;
				this.ngayNhap = ngayNhap;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
