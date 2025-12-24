
export function generateVietQR({ bankBin, accountNumber, amount, content }: { bankBin: string, accountNumber: string, amount?: string, content?: string }): string {
  // 00: Payload Format Indicator
  const id00 = "000201";
  
  // 01: Point of Initiation Method (12 for Dynamic/Amount, 11 for Static)
  // We use 12 if amount is present, else 11 usually, but 12 is safer for transfers.
  const id01 = amount ? "010212" : "010211";

  // 38: Merchant Account Information
  // GUID: A000000727
  // Service Code: QRIBFTTA
  const guid = "0010A000000727";
  const service = "0108QRIBFTTA"; // QRIBFTTA means Transfer to Account
  
  // Beneficiary Organization (Bank + Account)
  // 00: BIN (6 digits)
  // 01: Account Number
  const binTag = `00${bankBin.length.toString().padStart(2, '0')}${bankBin}`;
  const accTag = `01${accountNumber.length.toString().padStart(2, '0')}${accountNumber}`;
  const serviceProviderIndexMap = binTag + accTag;
  
  const id38Content = guid + service + `02${serviceProviderIndexMap.length.toString().padStart(2, '0')}${serviceProviderIndexMap}`;
  const id38 = `38${id38Content.length.toString().padStart(2, '0')}${id38Content}`;

  // 53: Transaction Currency (704 = VND)
  const id53 = "5303704";

  // 54: Transaction Amount (Optional)
  let id54 = "";
  if (amount) {
    id54 = `54${amount.length.toString().padStart(2, '0')}${amount}`;
  }

  // 58: Country Code (VN)
  const id58 = "5802VN";

  // 62: Additional Data Field (Optional) - Payment Content
  let id62 = "";
  if (content) {
    const contentTag = `08${content.length.toString().padStart(2, '0')}${content}`;
    id62 = `62${contentTag.length.toString().padStart(2, '0')}${contentTag}`;
  }

  // Assemble String (without CRC)
  const rawQR = id00 + id01 + id38 + id53 + id54 + id58 + id62 + "6304";

  // Calculate CRC16 (CCITT-False)
  const crc = calculateCRC16(rawQR);
  
  return rawQR + crc;
}

function calculateCRC16(str: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        crc ^= (c << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    // Mask to 16-bit
    crc &= 0xFFFF; // Typically standard standard mask
    return crc.toString(16).toUpperCase().padStart(4, '0');
}
