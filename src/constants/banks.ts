export interface Bank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo?: string;
}

export const VIETQR_BANKS: Bank[] = [
    { id: 17, name: "Ngân hàng TMCP Công thương Việt Nam", code: "ICB", bin: "970415", shortName: "VietinBank" },
    { id: 43, name: "Ngân hàng TMCP Ngoại Thương Việt Nam", code: "VCB", bin: "970436", shortName: "Vietcombank" },
    { id: 21, name: "Ngân hàng TMCP Quân Đội", code: "MB", bin: "970422", shortName: "MBBank" },
    { id: 2, name: "Ngân hàng TMCP Kỹ thương Việt Nam", code: "TCB", bin: "970407", shortName: "Techcombank" },
    { id: 4, name: "Ngân hàng TMCP Á Châu", code: "ACB", bin: "970416", shortName: "ACB" },
    { id: 26, name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", code: "VPB", bin: "970432", shortName: "VPBank" },
    { id: 25, name: "Ngân hàng TMCP Tiên Phong", code: "TPB", bin: "970423", shortName: "TPBank" },
    { id: 38, name: "Ngân hàng TMCP Sài Gòn Thương Tín", code: "STB", bin: "970403", shortName: "Sacombank" },
    { id: 8, name: "Ngân hàng TMCP Nam Á", code: "NAB", bin: "970428", shortName: "NamABank" },
    { id: 30, name: "Ngân hàng TMCP Bản Việt", code: "VCCB", bin: "970454", shortName: "VietCapitalBank" },
    { id: 6, name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", code: "BIDV", bin: "970418", shortName: "BIDV" },
    { id: 24, name: "Ngân hàng TMCP Quốc Tế Việt Nam", code: "VIB", bin: "970441", shortName: "VIB" },
    { id: 22, name: "Ngân hàng TMCP Hàng Hải Việt Nam", code: "MSB", bin: "970426", shortName: "MSB" },
    { id: 18, name: "Ngân hàng TMCP Kiên Long", code: "KLB", bin: "970452", shortName: "KienlongBank" },
    { id: 31, name: "Ngân hàng TMCP Việt Á", code: "VAB", bin: "970427", shortName: "VietABank" },
    { id: 19, name: "Ngân hàng TMCP Quốc Dân", code: "NCB", bin: "970419", shortName: "NCB" },
    { id: 10, name: "Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam", code: "EIB", bin: "970431", shortName: "Eximbank" },
    { id: 41, name: "Ngân hàng TMCP Phương Đông", code: "OCB", bin: "970448", shortName: "OCB" },
    { id: 20, name: "Ngân hàng TMCP Sài Gòn - Hà Nội", code: "SHB", bin: "970443", shortName: "SHB" },
    { id: 3, name: "Ngân hàng TMCP Phát triển TP. HCM", code: "HDB", bin: "970437", shortName: "HDBank" },
    { id: 32, name: "Ngân hàng TMCP Việt Nam Thương Tín", code: "VIETBANK", bin: "970433", shortName: "VietBank" },
    { id: 36, name: "Ngân hàng Wooribank", code: "WOO", bin: "970457", shortName: "Woori" },
    { id: 35, name: "Ngân hàng Shinhan Bank", code: "SHIN", bin: "970424", shortName: "ShinhanBank" },
    { id: 45, name: "Ngân hàng United Overseas Bank", code: "UOB", bin: "970458", shortName: "UOB" },
];
