/** Money with cents, as the Konta app shows it: "$ 1.000,00". */
export function money(value: number): string {
  const [int, dec] = Math.abs(value).toFixed(2).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${value < 0 ? "−" : ""}$ ${grouped},${dec}`;
}
