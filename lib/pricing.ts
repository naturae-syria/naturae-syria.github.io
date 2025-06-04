export function transformPrice(priceBRL: number | string): number {
  if (priceBRL === undefined || priceBRL === null || isNaN(Number(priceBRL))) return 0;
  const base = parseFloat(String(priceBRL));
  if (base >= 106) return base * 1.5;
  if (base >= 60) return base * 2;
  if (base < 20) return base * 4.2;
  return base <= 50 ? base * 3.2 : base * 2.5;
}

export function convertToUSD(brlAmount: number | string, usdRate: number): string {
  if (
    brlAmount === undefined ||
    brlAmount === null ||
    isNaN(Number(brlAmount)) ||
    usdRate === undefined ||
    usdRate === null ||
    isNaN(Number(usdRate))
  ) {
    return "";
  }
  const value = parseFloat(String(brlAmount)) * usdRate;
  return (Math.ceil(value * 10) / 10).toFixed(1);
}
