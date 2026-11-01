export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat("id-ID").format(absVal);
  return `${isNegative ? "-Rp " : "Rp "}${formatted}`;
}

export function formatRawRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(Math.abs(amount));
}
