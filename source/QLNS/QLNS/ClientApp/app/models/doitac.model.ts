export class DoiTac {
		public doiTacId: number;
		public tenDoiTac: string;
		public maDoiTac: string;
		public anhDaiDien: string;
		public nguoiTao: string;
		public ngayTao: string;
		public nguoiSua: string;
		public ngaySua: string;
    
    constructor(doiTacId?: number, tenDoiTac?: string, maDoiTac?: string, anhDaiDien?: string, nguoiTao?: string, ngayTao?: string, nguoiSua?: string, ngaySua?: string)
    {
				this.doiTacId = doiTacId;
				this.tenDoiTac = tenDoiTac;
				this.maDoiTac = maDoiTac;
				this.anhDaiDien = anhDaiDien;
				this.nguoiTao = nguoiTao;
				this.ngayTao = ngayTao;
				this.nguoiSua = nguoiSua;
				this.ngaySua = ngaySua;
    }
}
