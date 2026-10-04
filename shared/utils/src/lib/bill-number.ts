export const formatBillNumber = (billNumber: number) =>
  `INV-${String(billNumber).padStart(4, '0')}`;
