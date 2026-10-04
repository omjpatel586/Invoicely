const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const SCALES: Array<[number, string]> = [
  [10000000, 'Crore'],
  [100000, 'Lakh'],
  [1000, 'Thousand'],
  [100, 'Hundred'],
];

const belowHundredToWords = (value: number) =>
  value < 20
    ? ONES[value]
    : [TENS[Math.floor(value / 10)], ONES[value % 10]]
        .filter(Boolean)
        .join(' ');

const integerToWords = (value: number): string => {
  if (value === 0) {
    return 'Zero';
  }

  const words: string[] = [];
  let remaining = value;

  for (const [scale, label] of SCALES) {
    if (remaining >= scale) {
      words.push(`${integerToWords(Math.floor(remaining / scale))} ${label}`);
      remaining %= scale;
    }
  }

  if (remaining > 0) {
    words.push(belowHundredToWords(remaining));
  }

  return words.join(' ');
};

export const amountInWords = (amount: string | null) => {
  const paiseTotal = Math.round(Number.parseFloat(amount ?? '0') * 100) || 0;
  const rupees = Math.floor(paiseTotal / 100);
  const paise = paiseTotal % 100;

  const rupeesText = `${integerToWords(rupees)} Rupees`;
  const paiseText = paise ? ` and ${belowHundredToWords(paise)} Paise` : '';

  return `${rupeesText}${paiseText} Only`;
};
