export function Currency({ amount, code }: { amount: number; code: string }) {
  const locale = navigator.languages?.length
    ? navigator.languages[0]
    : navigator.language;

  if (!code) {
    return <>–</>;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(amount);
}
