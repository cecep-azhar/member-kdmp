type DateFormat = 'short' | 'long' | 'numeric';

const DATE_FORMAT_OPTIONS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  numeric: { day: 'numeric', month: 'numeric', year: 'numeric' },
  short: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
};

export function formatDate(date: string | Date, format: DateFormat = 'long'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', DATE_FORMAT_OPTIONS[format]);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('id-ID');
}

export function formatCurrencyInput(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function formatTenor(months: number): string {
  return `${months} bulan`;
}
