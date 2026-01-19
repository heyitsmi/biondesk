import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(new Date(date));
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
}

// Generate document number
export function generateDocumentNumber(type: 'quote' | 'invoice' | 'proposal', sequence: number): string {
  const year = new Date().getFullYear();
  const prefix = type === 'quote' ? 'Q' : type === 'invoice' ? 'INV' : 'P';
  return `${prefix}-${year}-${String(sequence).padStart(3, '0')}`;
}

// Generate public token for documents
export function generatePublicToken(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

// Calculate document totals
export interface DocumentItem {
  quantity: number;
  unit_price: number;
}

export function calculateDocumentTotals(
  items: DocumentItem[],
  tax: number = 0,
  discount: number = 0
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = subtotal * (tax / 100);
  const discountAmount = discount;
  const total = subtotal + taxAmount - discountAmount;
  
  return { subtotal, taxAmount, total };
}

// Get status badge color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'badge-draft',
    sent: 'badge-sent',
    viewed: 'badge-viewed',
    accepted: 'badge-accepted',
    paid: 'badge-paid',
    overdue: 'badge-overdue',
    won: 'badge-won',
    lost: 'badge-lost',
    inbox: 'badge-draft',
    drafting: 'badge-sent',
    negotiation: 'badge-viewed',
  };
  return colors[status] || 'badge-draft';
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
