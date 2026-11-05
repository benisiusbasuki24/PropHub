// Utility for formatting Indonesian Rupiah (IDR) and numbers

export function formatRupiah(amount: number, shortFormat = false): string {
  if (isNaN(amount) || amount === 0) return 'Rp 0';

  if (shortFormat) {
    if (amount >= 1_000_000_000) {
      const billions = (amount / 1_000_000_000).toFixed(1).replace('.0', '');
      return `Rp ${billions.replace('.', ',')} Miliar`;
    }
    if (amount >= 1_000_000) {
      const millions = (amount / 1_000_000).toFixed(0);
      return `Rp ${millions} Juta`;
    }
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val);
}

export function calculateKPR(
  propertyPrice: number,
  downPayment: number,
  tenorYears: number,
  annualInterestRate: number
) {
  const loanPrincipal = Math.max(0, propertyPrice - downPayment);
  const totalMonths = tenorYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;

  if (loanPrincipal <= 0 || totalMonths <= 0) {
    return {
      monthlyInstallment: 0,
      totalPayment: 0,
      totalInterest: 0,
      loanPrincipal: 0,
      minimumIncomeRecommended: 0,
    };
  }

  let monthlyInstallment = 0;
  if (monthlyRate === 0) {
    monthlyInstallment = loanPrincipal / totalMonths;
  } else {
    // Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyInstallment = (loanPrincipal * (monthlyRate * factor)) / (factor - 1);
  }

  const totalPayment = monthlyInstallment * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanPrincipal);

  return {
    monthlyInstallment: Math.round(monthlyInstallment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    loanPrincipal: Math.round(loanPrincipal),
    minimumIncomeRecommended: Math.round(monthlyInstallment / 0.35), // Recommended DSR max 35%
  };
}

export function calculateDaysRemaining(targetDateIso?: string): { days: number; isExpired: boolean } {
  if (!targetDateIso) return { days: 0, isExpired: true };
  const now = new Date().getTime();
  const target = new Date(targetDateIso).getTime();
  const diffMs = target - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    days: Math.max(0, days),
    isExpired: days <= 0,
  };
}
