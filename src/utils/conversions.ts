import { LandUnit } from '../types';

export const UNIT_RATES_SQFT: Record<LandUnit, number> = {
  sqft: 1,
  shotok: 435.6,
  katha: 720,
  bigha: 14400, // ২০ কাঠা = ১৪,৪০০ বর্গফুট (প্রায় ৩৩.০৬ শতক)
  acre: 43560,  // ১০০ শতক = ৪৩,৫৬০ বর্গফুট
  hectare: 107639.1,
  sqmeter: 10.7639,
  sqyd: 9,
  chhatak: 45, // ১ কাঠা = ১৬ ছটাক (৭২০/১৬ = ৪৫ বর্গফুট)
  kani_ctg: 17424, // চট্টগ্রাম কানি = ৪০ শতক
  kani_tripura: 17280, // ২৪ কাঠা = ১৭,২৮০ বর্গফুট
  keyar: 13068, // সিলেট কিয়ার = ৩০ শতক
  gonda: 871.2, // ২০ গণ্ডা = ১ কানি (চট্টগ্রাম) বা ৪ কড়া = ১ গণ্ডা (২ শতক)
  kora: 217.8, // ১ কড়া = ০.৫ শতক
  kranti: 72.6, // ১ ক্রান্তি = ১/৬ শতক
  til: 3.63, // ২০ তিল = ১ ক্রান্তি
};

export const UNIT_LABELS: Record<LandUnit, { bn: string; en: string; subtitle: string }> = {
  shotok: { bn: 'শতক / শতাংশ / ডেসিমল', en: 'Shotok / Decimal', subtitle: '৪৩৫.৬ বর্গফুট' },
  katha: { bn: 'কাঠা', en: 'Katha', subtitle: '৭২০ বর্গফুট (১৬ ছটাক)' },
  bigha: { bn: 'বিঘা', en: 'Bigha', subtitle: '১৪,৪০০ বর্গফুট (২০ কাঠা)' },
  acre: { bn: 'একর', en: 'Acre', subtitle: '৪৩,৫৬০ বর্গফুট (১০০ শতক)' },
  sqft: { bn: 'বর্গফুট (Sq. Feet)', en: 'Square Feet', subtitle: 'ভিত্তি পরিমাপ' },
  hectare: { bn: 'হেক্টর', en: 'Hectare', subtitle: '১০৭,৬৩৯.১ বর্গফুট (~২.৪৭ একর)' },
  sqmeter: { bn: 'বর্গমিটার (Sq. Meter)', en: 'Square Meter', subtitle: '১০.৭৬৪ বর্গফুট' },
  sqyd: { bn: 'বর্গগজ (Sq. Yard)', en: 'Square Yard', subtitle: '৯ বর্গফুট' },
  chhatak: { bn: 'ছটাক', en: 'Chhatak', subtitle: '৪৫ বর্গফুট' },
  kani_ctg: { bn: 'কানি (চট্টগ্রাম)', en: 'Kani (Chittagong)', subtitle: '১৭,৪২৪ বর্গফুট (৪০ শতক)' },
  kani_tripura: { bn: 'কানি (কুমিল্লা / ত্রিপুরা)', en: 'Kani (Comilla/Tripura)', subtitle: '১৭,২৮০ বর্গফুট (২৪ কাঠা)' },
  keyar: { bn: 'কিয়ার (সিলেট)', en: 'Keyar (Sylhet)', subtitle: '১৩,০৬৮ বর্গফুট (৩০ শতক)' },
  gonda: { bn: 'গণ্ডা', en: 'Gonda', subtitle: '৮৭১.২ বর্গফুট (৪ কড়া)' },
  kora: { bn: 'কড়া', en: 'Kora', subtitle: '২১৭.৮ বর্গফুট (৩ ক্রান্তি)' },
  kranti: { bn: 'ক্রান্তি', en: 'Kranti', subtitle: '৭২.৬ বর্গফুট (২০ তিল)' },
  til: { bn: 'তিল', en: 'Til', subtitle: '৩.৬৩ বর্গফুট' },
};

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnDigits(num: number | string, decimals = 3): string {
  if (num === '' || num === null || num === undefined || isNaN(Number(num))) return '০';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (n === 0) return '০';

  let formatted = '';
  if (Number.isInteger(n)) {
    formatted = n.toLocaleString('en-US');
  } else if (Math.abs(n) < 0.001) {
    formatted = n.toFixed(decimals);
  } else {
    formatted = n.toLocaleString('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0,
    });
  }

  return formatted.replace(/[0-9]/g, (digit) => BN_DIGITS[parseInt(digit, 10)]);
}

export function formatNum(num: number, useBn: boolean, decimals = 3): string {
  if (isNaN(num)) return useBn ? '০' : '0';
  if (useBn) return toBnDigits(num, decimals);
  if (Number.isInteger(num)) return num.toLocaleString('en-US');
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

export function convertFromSqFt(sqft: number) {
  return {
    sqft,
    shotok: sqft / UNIT_RATES_SQFT.shotok,
    katha: sqft / UNIT_RATES_SQFT.katha,
    bigha: sqft / UNIT_RATES_SQFT.bigha,
    acre: sqft / UNIT_RATES_SQFT.acre,
    hectare: sqft / UNIT_RATES_SQFT.hectare,
    sqmeter: sqft / UNIT_RATES_SQFT.sqmeter,
    sqyd: sqft / UNIT_RATES_SQFT.sqyd,
    chhatak: sqft / UNIT_RATES_SQFT.chhatak,
    kani_ctg: sqft / UNIT_RATES_SQFT.kani_ctg,
    kani_tripura: sqft / UNIT_RATES_SQFT.kani_tripura,
    keyar: sqft / UNIT_RATES_SQFT.keyar,
    gonda: sqft / UNIT_RATES_SQFT.gonda,
    kora: sqft / UNIT_RATES_SQFT.kora,
    kranti: sqft / UNIT_RATES_SQFT.kranti,
    til: sqft / UNIT_RATES_SQFT.til,
  };
}

export function getCombinedBighaKathaShotok(shotokTotal: number, useBn = true) {
  if (shotokTotal <= 0 || isNaN(shotokTotal)) {
    return useBn ? '০ বিঘা ০ কাঠা ০ শতক' : '0 Bigha 0 Katha 0 Shotok';
  }

  // ১ বিঘা = ২০ কাঠা = ১৪,৪০০ বর্গফুট / ৪৩৫.৬ ≈ ৩৩.০৫৭৮৫ শতক
  const shotokPerBigha = 14400 / 435.6; // ≈ 33.05785
  const shotokPerKatha = 720 / 435.6;   // ≈ 1.65289

  const bighas = Math.floor(shotokTotal / shotokPerBigha);
  const remainingAfterBigha = shotokTotal - (bighas * shotokPerBigha);
  const kathas = Math.floor(remainingAfterBigha / shotokPerKatha);
  const shotoks = remainingAfterBigha - (kathas * shotokPerKatha);

  if (useBn) {
    return `${toBnDigits(bighas, 0)} বিঘা ${toBnDigits(kathas, 0)} কাঠা ${toBnDigits(shotoks, 2)} শতক`;
  }
  return `${bighas} Bigha ${kathas} Katha ${shotoks.toFixed(2)} Shotok`;
}
