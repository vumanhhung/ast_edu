export class QuocGia {
		public quocGiaId: number;
		public tenQuocGia: string;
		public kyHieu: string;
		public viTriHieuThi: number;
		public ngayTao: Date;
		public nguoiTao: string;
		public ngaySua: Date;
		public nguoiSua: string;
    
    constructor(quocGiaId?: number, tenQuocGia?: string, kyHieu?: string, viTriHieuThi?: number, ngayTao?: Date, nguoiTao?: string, ngaySua?: Date, nguoiSua?: string)
    {
				this.quocGiaId = quocGiaId;
				this.tenQuocGia = tenQuocGia;
				this.kyHieu = kyHieu;
				this.viTriHieuThi = viTriHieuThi;
				this.ngayTao = ngayTao;
				this.nguoiTao = nguoiTao;
				this.ngaySua = ngaySua;
				this.nguoiSua = nguoiSua;
    }
}
