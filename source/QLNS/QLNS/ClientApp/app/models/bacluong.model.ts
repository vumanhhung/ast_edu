export class BacLuong {
		public bacLuongId: number;
		public tenBacLuong: string;
		public tienLuong: number;
		public ngayTao: string;
		public nguoiTao: string;
		public ngaySua: string;
		public nguoiSua: string;
    
    constructor(bacLuongId?: number, tenBacLuong?: string, tienLuong?: number, ngayTao?: string, nguoiTao?: string, ngaySua?: string, nguoiSua?: string)
    {
				this.bacLuongId = bacLuongId;
				this.tenBacLuong = tenBacLuong;
				this.tienLuong = tienLuong;
				this.ngayTao = ngayTao;
				this.nguoiTao = nguoiTao;
				this.ngaySua = ngaySua;
				this.nguoiSua = nguoiSua;
    }
}
